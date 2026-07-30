/**
 * Cross-cutting auth negative for the cart module. All four cart endpoints are
 * gated by `requireApiKey`, so a single parametrized scenario proves that a
 * missing or wrong `x-api-key` is rejected as 401 unauthorized — no request
 * duplicated per endpoint.
 */
import { spec } from "pactum";

type Spec = ReturnType<typeof spec>;
type Method = "get" | "post" | "delete";

type RejectArgs = {
  method: Method;
  path: string;
  /** Omit for the missing-key case; pass a bad value for the wrong-key case. */
  apiKey?: string;
  body?: unknown;
  status?: number;
  error?: string;
};

export async function cartRequestIsRejected({
  method,
  path,
  apiKey,
  body,
  status = 401,
  error = "unauthorized",
}: RejectArgs): Promise<void> {
  let request: Spec = spec()[method](path);

  if (apiKey !== undefined) request = request.withHeaders({ "x-api-key": apiKey });
  if (body !== undefined) request = request.withJson(body as Record<string, unknown>);

  await request.expectStatus(status).expectJsonLike({ error }).toss();
}
