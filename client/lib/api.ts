const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/+$/, "");

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  errors?: Array<{ feild: string; message: string }>;

  constructor(
    message: string,
    status: number,
    errorCode?: string,
    errors?: Array<{ feild: string; message: string }>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const hadToken = !!token;

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (hadToken && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401, "ACCESS_UNAUTHORIZED");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      res.status,
      data.errorCode,
      data.errors
    );
  }

  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  expiresAt: number;
}

export async function registerUser(payload: RegisterPayload) {
  return apiFetch<{ sucess: boolean; message: string; user: { user: User } }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Files ───────────────────────────────────────────────────────────────────

export interface FileItem {
  _id: string;
  userId: string;
  originalName: string;
  mimeType: string;
  size: number;
  formattedSize: string;
  ext: string;
  uploadVia: "WEB" | "API";
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  skip?: number;
}

export interface GetFilesParams {
  keyword?: string;
  pageSize?: number;
  pageNumber?: number;
}

export async function getFiles(params: GetFilesParams = {}) {
  const q = new URLSearchParams();
  if (params.keyword) q.set("keyword", params.keyword);
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.pageNumber) q.set("pageNumber", String(params.pageNumber));
  const qs = q.toString();
  return apiFetch<{ message: string; files: FileItem[]; pagination: Pagination }>(
    `/files/all${qs ? `?${qs}` : ""}`
  );
}

export async function uploadFiles(files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));
  return apiFetch<{
    results: {
      message: string;
      data: Array<{ fileId: string; originalName: string; size: number; ext: string; mimeType: string }>;
      failedCount: string;
    };
  }>("/files/upload", { method: "POST", body: fd });
}

export async function downloadFiles(fileIds: string[]) {
  return apiFetch<{ message: string; downloadUrl: string; isZip: boolean }>(
    "/files/download",
    { method: "POST", body: JSON.stringify({ fileIds }) }
  );
}

export async function deleteFiles(fileIds: string[]) {
  return apiFetch<{ message: string; deletedCount: number; failedCount: number }>(
    "/files/bulk-delete",
    { method: "DELETE", body: JSON.stringify({ fileIds }) }
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface ChartPoint {
  date: string;
  uploadedFiles: number;
  usages: number;
  formattedUsages: string;
}

export interface StorageUsageSummary {
  totalUsage: number;
  quota: number;
  remaining: number;
  formattedTotalUsage: string;
  formattedQuota: string;
  formattedRemaining: string;
}

export interface AnalyticsResponse {
  message: string;
  chart: ChartPoint[];
  totalUploadedFilesForPeriod: number;
  totalUsagesForPeriod: string;
  storageUsageSummary: StorageUsageSummary;
}

export async function getAnalytics(from: string, to: string) {
  return apiFetch<AnalyticsResponse>(
    `/analytics/user?from=${from}&to=${to}`
  );
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export interface ApiKey {
  _id: string;
  userId: string;
  name: string;
  displayKey: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

export async function createApiKey(name: string) {
  return apiFetch<{ message: string; key: string }>("/apikey/create", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function getApiKeys(params: { pageSize?: number; pageNumber?: number } = {}) {
  const q = new URLSearchParams();
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.pageNumber) q.set("pageNumber", String(params.pageNumber));
  const qs = q.toString();
  return apiFetch<{ apiKeys: ApiKey[]; pagination: Pagination }>(
    `/apikey/all${qs ? `?${qs}` : ""}`
  );
}

export async function deleteApiKey(id: string) {
  return apiFetch<{ success: boolean }>(`/apikey/${id}`, {
    method: "DELETE",
  });
}
