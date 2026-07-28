import { env } from "../config/env";

export const authHeaders = (): Record<string, string> => ({ "x-api-key": env.apiKey });
