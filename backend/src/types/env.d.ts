declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    MONGO_URI_DEV?: string;
    MONGO_URI_PROD?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    LOG_LEVEL?: string;
    ALLOWED_ORIGINS?: string;
    BASE_PATH?: string;
    AWS_ACCESS_KEY?: string;
    AWS_SECRET_KEY?: string;
    AWS_REGION?: string;
    AWS_S3_BUCKET?: string;
    LOGTAIL_SOURCE_TOKEN?: string;
    LOGTAIL_INGESTING_HOST?: string;
  }
}
