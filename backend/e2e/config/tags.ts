/**
 * Tags live in the jest test title, so `-t "@happy"` doubles as the filter.
 *
 * Workflow ID convention:
 *   WF-{DOMAIN}-{N}-H            happy chain          -> *.happy.workflow.ts
 *   WF-{DOMAIN}-{N}-NEG          negative suite       -> tag @negative
 *   WF-{DOMAIN}-{N}-S{s}-N{v}    one negative case    -> *.neg.workflow.ts
 *   SHARED-{PATTERN}-N{n}        cross-cutting negative
 */
export const TAGS = {
  HAPPY: "@happy",
  NEGATIVE: "@negative",
  EXAMPLE: "@example",
  SANITY: "@l0-sanity",
  SMOKE: "@l1-smoke",
  REGRESSION: "@l2-regression",
} as const;

/** Builds a jest test title: `WF-CATALOG-1-H @happy @l1-smoke — description`. */
export const title = (id: string, tags: string[], description: string) =>
  `${id} ${tags.join(" ")} — ${description}`;
