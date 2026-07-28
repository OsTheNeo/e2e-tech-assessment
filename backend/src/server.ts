import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4010);

createApp().listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${port}/api/v1`);
});
