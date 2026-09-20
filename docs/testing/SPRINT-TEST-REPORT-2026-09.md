# iCAP Sprint Test Report — Coach Loop and Export

**Document type:** Test summary report (IEEE 829 style) + sprint retrospective  
**Project:** iCAP Battery (AIDE_OS / local kiosk)  
**Dates:** 2026-09-18 through 2026-09-19  
**Author:** Joshua Hickman  
**Status:** Coach loop frozen. Human battery testing not started.

This is a lab notebook for the repo, not a claim that the battery is validated. Scores in the mock files are fixtures. They are not my results.

---

## 1. Purpose of this sprint

The app already exports a local markdown profile and offers a copy-to-chat coach prompt. The job this weekend was to make that loop usable by an average taker (WorkSource / employment office demo), without forcing them to write a professional prompt or read Validity flags.

Controls I used on every platform run:

- New chat, default model, no saved memory.
- Same starter pasted every time.
- Same filled Context Refinement Form on Turn 2.
- Mock profiles only. I did not take the battery for real during this sprint.
- I erased user data and started from a black slate between runs.

Platforms under test: Claude, Gemini, ChatGPT, and Grok (default consumer tiers). Those four cover most dedicated U.S. chat traffic. Copilot and Meta AI were noted as later checks, not this sprint.

---

## 2. What was already in the tree

Before this sprint the live kiosk had already dropped official HEXACO-PI-R item text and official ICAR item banks from the product path. Affect is IPIP public-domain items. Cognition is original series/verbal plus generated figures. Interest remains the O*NET Interest Profiler Short Form. Export caution text no longer names ICAR.

That legal cut is a separate record (`_archive/2026-09-legal-cut/`). This report does not re-open item banks.

---

## 3. Scope

**In scope**

- Export markdown shape (Validity block, source URLs, no banned instrument names in coaching copy).
- One starter prompt + two-turn loop.
- Context Refinement Form printed by the model, filled by the user.
- Cross-platform consistency of *behavior* (stop, quote Validity, honor the form), not identical job lists.

**Out of scope**

- Five-person human protocol.
- Matrix G/H empty-button fix (product bug, tracked separately).
- Branding, slides, or WorkSource pitch copy.
- Replacing O*NET or IPIP.

---

## 4. Test log

### Test 1 — First coach prompt (pre-loop)

One-shot “coach me in five numbered sections” against a click-through export.

**Result:** All four models wrote a full career essay in the first bubble. They treated 6/60 and working-memory 0 as a person. ChatGPT copied leftover “ICAR” language from the old export caution. Gemini leaked internal thinking. Nobody asked whether the sitting was real.

**Finding:** A single professional prompt is not a consumer product. The export was also teaching the model the wrong story.

### Test 2 — Two-turn prompt, planted contradiction

Turn 1 asked the model to stop and ask four questions. Turn 2 answers said: practice click-through, do not ignore any section, *and* prioritize Cognition / Affect / Process over Interest.

**Result:** Turn 1 passed on all four platforms. Turn 2 correctly refused to treat flagged scores as ability, even though I told them to prioritize those scores. Claude named the contradiction most clearly.

**Finding:** The loop works when the starter owns the conflict. The user should not have to invent that conflict in prose.

### Design cut — no prompt suite

I considered shipping `agent.md`, `sources.md`, `constraints.md`, and a ten-step upload ritual. That is over-engineered for this context. A WorkSource taker will drop a file. Default path stays **one export + one starter + a form the chat prints**.

A counselor zip can wait until staff ask for it.

### Test 3 — Real-sitting fixture (`jeff-profile.md` = mock-complete)

Same starter. Form said: sitting real, Central Texas and Pacific Northwest, one year, no government, no medical, short-term projects, ADHD and PTSD as extra context.

**Turn 1:** Pass on all four.

**Turn 2 leaks:**

| Platform | Leak |
| --- | --- |
| Gemini | Massage therapist (licensed care). |
| Grok | Substitute teacher and teaching assistant (public school / district credential). |
| ChatGPT | Occupation links dumped at the bottom instead of on each path. |
| Claude | Held the bans. Best default coach for this product. |

**Finding:** “No medical” and “no government” were being read as job titles. They need to be read as workplaces.

### Test 4 — Same fixture, workplace-ban patch on Turn 2

Added: apply bans to the workplace; medical includes clinics, dental, massage, therapy, nursing; government includes public schools and civil-service credentials; one My Next Move URL per bullet; keep the strongest interest theme.

**Result:** Massage gone. Public-school jobs gone. Per-item links present. Shared core across platforms: fitness trainer, event planner, tour guide. Edge drift remains (real estate, trades, corporate trainer). That drift is acceptable. I am not chasing identical lists.

**Finding:** Freeze the starter. Stop prompt QA on fixtures.

---

## 5. Frozen coach contract

The Copy-button string is the starter in `icap-starter.txt` (repo copy should live next to `src/lib/cap/chat-prompt.ts`).

Behavior that is now required:

1. If the file is missing, stop and ask for it.
2. Turn 1 confirms name and date, says complete / rushed / mixed in plain language, names a list-vs-scores split in one sentence, prints the empty Context Refinement Form, and stops.
3. Turn 2 follows the form over the file when they disagree.
4. Practice or Validity FLAG: do not treat puzzle, personality, or memory numbers as a picture of the person. Process tasks are unusable on a click-through unless the taker says those tasks were real.
5. Real sitting and no FLAG: session numbers may be used. They are not IQ.
6. Sector bans apply to the usual employer, not the job title.
7. Each recommended path carries its own real URL on the same bullet. No search-wrapper links.
8. No diagnosis, pay promises, flattery, hidden reasoning, or banned instrument brand names in coaching copy.

The taker never has to read Validity. The model does.

---

## 6. Export contract (do not regress)

The downloaded markdown must keep:

- Header with the name the taker typed (not an inner fixture name such as `mock-complete`).
- Validity block computed from the session (affect flatline, working-memory math threshold, flanker noise, raw cognition total).
- Source URLs for O*NET Interest Profiler, My Next Move, and IPIP.
- Job list links to My Next Move.
- No “ICAR” or “HEXACO-PI-R” in caution or coaching copy. Sources page may keep “this is not …” disclaimers only.

If a renamed download still says `Name: mock-complete` inside the file, that is an export bug. Counselors will treat the file as a fixture.

---

## 7. Known defects still open

| ID | Item | Severity | Notes |
| --- | --- | --- | --- |
| P1 | Matrix options G and H render empty on scored items | Blocker for human testers | G = None of these, H = I don't know, text only. |
| P2 | Export `Name` field can retain fixture or filename leftovers | Medium | Must be the name typed on the Profile page. |
| P3 | Gemini sometimes wraps My Next Move URLs in a Google search link | Low | Starter now forbids wrappers. Re-check on next live file only. |
| P4 | Five-person protocol not run | Planned | Do not schedule testers until P1 is closed. |

---

## 8. Journal

**2026-09-18.** I click-through the battery to test export and chat, not to measure myself. The first export still talked like the old cognition block. Models believed it. That is on the file, not on the taker.

**2026-09-19 morning.** I planted a contradiction on purpose: practice sitting, do not ignore any section, prioritize the weak scores. I wanted to see whether the four platforms would invent ability out of a FLAG. They did not, once Turn 1 existed. Claude said the two instructions cannot both hold. That is the sentence I want in the product.

**Same day.** I almost built a document suite. Profile, agent, sources, constraints, a ten-step ritual. That is a failure for this audience. If the average person has to examine the file and write a steering prompt, the kiosk did not finish its job. One file. One paste. A form the model prints.

**Same day, afternoon.** Consistency across Claude, Gemini, ChatGPT, and Grok means the same *procedure*, not the same twelve job titles. When the form kills the file’s nurse list, each model improvises a new cluster. Fitness, events, and tours showed up enough times to call the loop stable. Massage and substitute teaching were real bugs. Workplace language fixed them. I am leaving the remaining drift alone.

**Close of sprint.** Prompt QA on mocks is done. The next honest test is a real sitting and a real name on the export. Until matrix G/H are labeled, I am not seating the five people who offered to try this.

---

## 9. Decision record

| Decision | Why |
| --- | --- |
| One export + one starter + printed CRF | Consumer path. No prompt suite. |
| Validity lives in the file; bans live in the starter | Taker fills blanks. Model applies rules. |
| Freeze after Test 4 | Bans and links held on all four platforms. |
| Do not claim ICAR or HEXACO-PI-R validity | Different items. Different product. |
| Human testers wait on P1 | Empty matrix choices contaminate cognition scores. |

---

## 10. Next sprint

1. Implement the frozen starter in the Copy button and `chat-prompt.ts`.
2. Confirm export Name + Validity + no banned brand names on a fresh download.
3. Fix matrix G/H.
4. One real sitting, new chats, same starter. That file is the first counselor-facing artifact.
5. Only then run the five-person protocol with fixed order, same kiosk, and a simple log (time, blockers, whether export and Turn 1 behaved).
