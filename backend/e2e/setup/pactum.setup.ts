import { request, settings } from "pactum";
import { env } from "../config/env";

request.setBaseUrl(env.baseUrl);
request.setDefaultTimeout(env.timeout);
request.setDefaultHeaders({ Accept: "application/json" });

settings.setLogLevel("WARN");

beforeAll(() => {
  // eslint-disable-next-line no-console
  console.log(`[e2e] base url: ${env.baseUrl}`);
});
