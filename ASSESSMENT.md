# Frontend Assessment: Promotion CMS Reliability

**Duration:** 120 minutes  
**Technology:** React, TypeScript, CSS, existing test framework  
**AI tools:** Permitted

## Business context

PromoOps is an internal CMS used by content editors to prepare multilingual
online-casino promotions. Editors can browse and filter promotions, select a
language, edit translated content, preview a promotion, and prepare it for
publication.

You are joining an unfamiliar existing project. Do not rebuild the application
or replace its framework.

## Support ticket CMS-1842

Customer Support reports:

> When an editor changes the selected promotion or language quickly, the
> preview sometimes displays content from the previously selected promotion or
> language. Editors are concerned that they could review or publish the wrong
> content.

The issue occurs more frequently on slower connections.

Known reproduction:

1. Select **Welcome Bonus**.
2. Select **German**.
3. Immediately select **Weekend Spins**.
4. Change the language to **French**.
5. Wait for all requests to finish.

The preview may show Welcome Bonus / German while Weekend Spins / French
remains selected. Changing only the language can produce a similar problem.

## Task A: diagnose and fix the preview defect

Investigate the existing implementation and fix the inconsistency.

The result must:

- Always show information that belongs to the currently selected promotion and
  language after loading settles.
- Keep preview content and operational feedback consistent with the visible
  selection during rapid interaction and on slow connections.
- Continue to behave correctly after changing only the language.
- Leave no unexpected warnings or side effects after navigating away.
- Distinguish loading, error, empty, and success states.
- Provide a functional, accessible retry action for the current selection.
- Never present unrelated content as belonging to the visible selection.
  Clearly labelled updating content is acceptable.
- Keep the rest of the application usable while the preview loads.

Work within the existing dependencies, and do not replace the mocked API with
static data.

## Task B: implement publication readiness

Complete `PublicationReadiness`. German is always required. Markets add these
requirements:

| Market | Required language |
| --- | --- |
| `CH-DE` | German (`de`) |
| `CH-FR` | French (`fr`) |
| `CH-IT` | Italian (`it`) |

Validate each required language only once. Title, body, CTA label, and CTA URL
must be present; whitespace-only values are invalid. CTA URLs must be valid,
absolute HTTPS URLs.

The schedule is valid only when both dates are valid and the end is later than
the start. The start does not need to be in the future.

The panel must:

- Show **Ready to publish** or **Not ready to publish**.
- Give specific blocking reasons grouped by language or schedule.
- Distinguish blocking errors from optional-language warnings.
- Disable Publish while blocking errors exist.
- Update immediately as content changes.

A preview fallback does not satisfy validation for a missing translation.

## Task C: UX and accessibility

Keep controls labelled and keyboard-operable. Selected languages must be
visually and programmatically identifiable. Loading and errors need appropriate
status/live-region semantics, and Retry needs an accessible name. Do not convey
disabled publication through colour alone or unexpectedly reset focus.

The page must not overflow horizontally at a 375-pixel viewport; panels may
stack at small widths.

## Task D: feature-flag safety

The new **Promotion activity** panel is being rolled out gradually through the
mocked `promotion-activity` feature flag. The flag service can return enabled,
disabled, or an error.

Make the rollout safe:

- Show the panel only after the flag is explicitly enabled.
- Do not request promotion activity while the flag is disabled.
- Do not briefly expose the panel while the flag is unresolved.
- A flag-service failure must leave the feature off without blocking the
  promotion editor, preview, or publication workflow.
- Activity shown after changing promotions must belong to the current
  promotion.
- Navigating away must not cause warnings or delayed UI updates.

Add a deterministic test covering at least the disabled or error case and
verify that the activity endpoint is not called when the feature is off. Do not
replace the runtime flag service with a build-time constant.

## Task E: catalogue performance

Run the high-volume scenario with:

```bash
npm run dev:performance
```

It loads the same application with 1,200 promotion records. Use browser
performance tooling or the React Profiler to identify why catalogue search or
editing content becomes less responsive.

Make one focused, maintainable improvement while preserving filtering,
selection, keyboard behavior, and the correctness work from Task A. Record the
following in `PERFORMANCE.md`:

- The interaction measured and test environment
- Before and after evidence
- The bottleneck you identified
- Why the change addresses it
- Remaining limitations

The evidence can be concise. A synthetic benchmark with no relationship to a
real interaction is insufficient, and adding a large dependency solely for
this task is discouraged.

## Required regression test

Add at least one deterministic behavioural regression test for the reported
incident. It must exercise rapid selection changes, verify the final visible
content, and fail against the original implementation.

Do not depend on real network timing. A test that only checks that rendering
returned a container is insufficient. Useful additional tests cover failure and
retry behavior, readiness, HTTPS validation, and optional translations.

## AI use

AI tools are permitted. You remain responsible for understanding, adapting,
and verifying submitted work. Do not submit private chain-of-thought or full
prompt transcripts.

Create `AI_USAGE.md` with:

```md
## Tool used

## Work delegated to AI

## Suggestions accepted

## Suggestions changed or rejected

## Verification performed

## Remaining risks
```

Brief factual entries are enough.

## Checkpoints

### Minute 15

Run and reproduce the application, inspect the code, and create `DIAGNOSIS.md`
(about 250 words maximum):

```md
## Reproduction

## Suspected root cause

## Files likely to change

## Proposed fix

## Verification plan

## Current uncertainty
```

### Minutes 15–65

Implement the core fix, operational preview states, publication readiness, and
the start of a regression test. If the core behavior is secure, begin the
feature-flag or performance task.

### Minutes 65–85

The evaluator will provide an AI-generated patch. Review it as a real pull
request. Accept, change, or reject individual parts, apply only safe work, and
record decisions in `AI_PATCH_REVIEW.md`.

### Minutes 85–105

The evaluator will provide an additional production requirement. Implement as
much as possible without regressing completed behavior.

### Minutes 105–120

Run tests and the build, review changes, remove debugging code, complete the AI
record, and create `HANDOVER.md` (200 words maximum) for an application manager
or Support lead. Cover cause, changes, verification, Support checks,
post-deployment monitoring, recovery/rollback, and remaining risks.

## Priority

1. Preview consistency
2. Meaningful regression test
3. Publication validation
4. Loading, error, empty, and retry states
5. Feature-flag safety
6. Catalogue performance
7. Changed requirement
8. Visual polish

A smaller verified implementation is preferable to a larger unverified one.
