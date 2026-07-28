import type { Server } from "http";
import { createApp } from "../../src/app";

declare global {
  // eslint-disable-next-line no-var
  var __API_SERVER__: Server | undefined;
}

export default async function globalSetup() {
  await new Promise<void>((resolve) => {
    globalThis.__API_SERVER__ = createApp().listen(4010, resolve);
  });

  console.log("[e2e] API started on http://localhost:4010/api/v1");
}
