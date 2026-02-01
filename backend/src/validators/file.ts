import z from "zod";
export const fileIdSchema = z.string().min(1);
export const baseSchema = z.object({
  fileIds: z
    .array(z.string().length(24, "Invalid File Id "))
    .min(1, "atleast one file id must be provided  "),
});

export const deleteFilesSchema = baseSchema;
export const downloadFilesSchema = baseSchema;

export type FileIdSchema = z.infer<typeof fileIdSchema>;
export type BaseSchema = z.infer<typeof baseSchema>;
export type DeleteFilesSchema = z.infer<typeof deleteFilesSchema>;
export type DownloadFilesSchema = z.infer<typeof downloadFilesSchema>;
