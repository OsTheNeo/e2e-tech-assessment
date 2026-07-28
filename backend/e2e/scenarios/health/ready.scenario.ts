import { spec } from "pactum";

export type ReadyResult = { status: string };

export async function serviceIsReady(): Promise<ReadyResult> {
  const response = await spec().get("/ready").expectStatus(200).toss();

  const body = response.json as ReadyResult;
  expect(body.status).toBe("Ok");

  return body;
}
