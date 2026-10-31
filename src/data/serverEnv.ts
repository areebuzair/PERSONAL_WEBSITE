import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const serverEnv = createEnv({
    server: {
        DATABASE_URL: z.url(),
        JWT_SECRET: z.string().min(32, "JWT Secret should be at least 32 characters long"),
        SESSION_VERSION: z.string()
    },
    experimental__runtimeEnv: process.env,
    emptyStringAsUndefined: true
});