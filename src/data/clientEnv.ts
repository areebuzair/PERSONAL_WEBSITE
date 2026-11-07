import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const clientEnv = createEnv({
    client: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
        NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string()
    },
    runtimeEnv: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    },
    emptyStringAsUndefined: true
});