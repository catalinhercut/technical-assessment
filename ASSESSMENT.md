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

## Suggested working flow and checkpoints

The assessment is designed for approximately 120 minutes, but the stages are
guidance rather than fixed cut-offs. Setup problems, clarification time, and a
candidate's chosen sequencing may shift a checkpoint. The evaluator will tell
you before recording a snapshot or introducing new material.

You may rebalance time between stages, provided the final submission is ready
at the agreed end of the exercise.

### Orientation checkpoint

During the opening part of the exercise—typically the first 15–20 minutes—run
and reproduce the application, inspect the code, and create `DIAGNOSIS.md`
(about 250 words maximum):

```md
## Reproduction

## Suspected root cause

## Files likely to change

## Proposed fix

## Verification plan

## Current uncertainty
```

The evaluator may capture an early snapshot once you have recorded a credible
diagnosis. You do not need to stop in the middle of an active investigation.

### Core implementation checkpoint

Implement the core fix, operational preview states, publication readiness, and
the start of a regression test. This should receive the largest share of the
assessment. The evaluator will normally capture a core snapshot when the main
correctness work has meaningful shape, around the middle of the session.

### AI-review checkpoint

After the core snapshot, the evaluator will provide an AI-generated patch.
Review it as a real pull request. Accept, change, or reject individual parts,
apply only safe work, and record decisions in `AI_PATCH_REVIEW.md`. A focused
review will usually take around 15–20 minutes, but judgment matters more than
using the entire window.

### Requirement-change checkpoint

During the final third of the exercise, the evaluator will provide an
additional production requirement. Implement as much as possible without
regressing completed behavior. The exact release point may move depending on
progress, but the evaluator should leave a practical implementation window.

### Final verification and handover

Reserve approximately the final 15–20 minutes for tests and the build, reviewing
changes, removing debugging code, completing the AI record, and creating
`HANDOVER.md` (200 words maximum) for an application manager or Support lead.
Cover cause, changes, verification, Support checks, post-deployment monitoring,
recovery/rollback, and remaining risks.

## Priority

1. Preview consistency
2. Meaningful regression test
3. Publication validation
4. Loading, error, empty, and retry states
5. Changed requirement
6. Operational handover

A smaller verified implementation is preferable to a larger unverified one.

## Post-assessment product evolution discussion

This discussion is separate from the standardized 120-minute implementation
exercise. Allow roughly 15–25 minutes for preparation and discussion; the
evaluator may adapt the balance based on the depth of the conversation.

Assume PromoOps must grow to support:

- 100 active editors
- 50,000 promotions
- Additional markets and languages
- Multiple production releases per week

Choose the two highest-value improvements you would make across editorial
efficiency, performance and scalability, reliability and observability, UI/UX
and accessibility, or frontend architecture.

For each recommendation, be ready to explain:

- The current limitation, using evidence from this repository
- User and business impact
- The proposed change and alternatives considered
- Trade-offs, risks, and what you would deliberately not build
- An incremental rollout or migration plan
- How you would measure success

The optional high-volume scenario is available through:

```bash
npm run dev:performance
```

It runs PromoOps with 1,200 promotion records and may be used as evidence. You
are not required to implement your product-evolution recommendations during
the coding exercise.

The discussion is evaluated separately and cannot compensate for failure of
the core preview-correctness requirements.
