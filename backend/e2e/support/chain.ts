/**
 * Chain guard — "fail at S, stop" semantics.
 *
 * Jest keeps running the remaining `it`s after a step fails, which turns one
 * broken step into a wall of misleading downstream failures. `chain()` records
 * the first failed step and marks every later step as skipped instead.
 */
export type Chain = {
  /** Wrap a step body so it stops the chain on failure. */
  step: (id: string, body: () => Promise<void>) => () => Promise<void>;
};

export function chain(): Chain {
  let failedAt: string | undefined;

  return {
    step: (id, body) => async () => {
      if (failedAt) {
        // Not a second defect — the chain already stopped upstream.
        console.warn(`[chain] ${id} skipped: stopped at ${failedAt}`);
        return;
      }
      try {
        await body();
      } catch (err) {
        failedAt = id;
        throw err;
      }
    },
  };
}
