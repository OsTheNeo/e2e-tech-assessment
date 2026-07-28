import type { Server } from "http";

export default async function globalTeardown() {
  const server = (globalThis as { __API_SERVER__?: Server }).__API_SERVER__;
  if (!server) return;

  await new Promise<void>((resolve) => server.close(() => resolve()));
}
