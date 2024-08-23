import { z } from "zod";

export const uploadImageSchema = z.object({
	media_name: z.string(),
	description: z.string().optional(),
	media_path: z.string().optional(),
	url: z.string().optional(),
	media_type: z.string().optional(),
	size: z.number().optional(),
	image: z.any(), // This field is specific to the upload process and not part of the MediaDocument
});

export type UploadImageDto = z.infer<typeof uploadImageSchema>;
