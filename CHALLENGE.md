# QA Engineer Technical Challenge

Welcome — thanks for taking the time. This document is the only spec you need.

## TL;DR

Build a small, well-designed automated test suite against the included Real Estate Platform. We care about **test design quality, not coverage volume**.

- ⏱  **Task assessment** to be sent to the candidate to be submitted back in 1-3 working days.
- 🎯  **Scope: 3 user stories** (listed below). Do them well rather than doing more shallowly.
- 🧰  **Stack: your choice** — Playwright, Cypress, WebDriver.IO, Selenium, supertest, etc. Use what you're fastest in.
- 📬  **Deliver: a pull request** against your fork. Include a short README explaining what you did, what you skipped, and why.

> **Note for senior candidates:** if you finish early, *do not* keep adding tests. Spend the remaining time on the "Stretch" section at the bottom — that's where we read for senior signal.

---

## The system under test

Local setup (≤ 5 min):

```bash
npm install
npm run dev    # starts web on :5173 and API on :3001
```

| Surface | URL |
|---|---|
| Web app | http://localhost:5173 |
| REST API | http://localhost:3001/api |
| API docs (Swagger) | http://localhost:3001/api/docs |
| OpenAPI spec | http://localhost:3001/api/openapi.json |

**Seed accounts** (password `Test123!` for all):

| Email | Role |
|---|---|
| `test@example.com` | user |
| `agent@example.com` | agent |
| `admin@example.com` | admin |

**Reset state between tests**:

```bash
curl -X POST http://localhost:3001/api/test/reset
```

Use this. Don't try to clean up state by hand inside tests.

---

## What to build

Pick **one** track based on what you want to be evaluated on. (If you're applying for a hybrid role, do the API track plus 1–2 web tests.)

### Track A — Web UI automation

Cover these three user stories. Each should have at minimum one happy-path test and one failure-path test.

1. **Login.** A registered user can log in with valid credentials. Invalid credentials show an error and the user stays on the login page.
2. **Property search.** A visitor can filter the properties list (by type / price range / location) and the results reflect the filters.
3. **Wishlist.** A logged-in user can add a property to their wishlist from a property card, and it appears on the user dashboard. An unauthenticated user is redirected to login when they try.

### Track B — API automation

Cover these three flows. Hit the API directly (do not drive the UI). Include positive + negative cases.

1. **Auth.** `POST /api/auth/register` → `POST /api/auth/login` → `GET /api/auth/me` round-trip; assert the JWT works; assert weak passwords and duplicate emails are rejected with the right status codes.
2. **Property search & filtering.** `GET /api/properties` with combinations of `type`, `minPrice`, `maxPrice`, `q`, and `sort`. Verify ordering for `sort=price_asc` and `sort=price_desc`, and that unknown values are rejected.
3. **Role authorization.** A `user` token cannot list `/api/users` (403) or create a property (403); an `agent` can create a property and the response stamps them as the owner; an `admin` can update any user.

---

## What we score

Equal weight on each row. We read your PR, your README, and your code — in that order.

| Area | What good looks like |
|---|---|
| **Test design** | One test = one behaviour. Names describe the behaviour. Assertions match the test's intent. No mystery setup. |
| **Reliability** | Tests pass reliably (run them 3× before submitting). No `sleep(5000)`. State reset between specs. No coupling to test order. |
| **Readability** | A teammate could read one of your tests cold and understand the user story. Page Objects / API client wrappers where they earn their weight, not as cargo cult. |
| **Data strategy** | Fixtures separated from test logic. Sensible use of the `/api/test/reset` endpoint or per-spec setup. |
| **Judgement** | What you chose **not** to test, and why. A short note in your README beats a wall of green checkmarks. |
| **Pragmatism** | Trade-offs visible. You picked the test that catches the most realistic bug, not the test that's easiest to write. |

What we **do not** score:
- Total test count, % coverage, lines of code.
- Whether you wrote a fancy Allure dashboard. (If it's free, sure; if it cost you 90 minutes, skip it.)
- Whether you finished. Strong stopping > weak completion.
- Framework choice — Playwright vs Cypress vs supertest are all fine.

---

## Submitting

1. **Fork** this repository.
2. Add your tests under `tests/` (top-level). Keep the existing app code untouched unless you're filing a real bug fix.
3. Add a `tests/README.md` that answers, in this order:
   - **What I built.** One paragraph.
   - **How to run it.** Exact command(s).
   - **What I skipped, and why.** This is the most important section.
   - **What I'd do next with another 4 hours.**
4. Open a PR against `main` of your fork. Send us the PR link.

Please **do not** open a PR against the upstream Aviv repository — it's a public reference, and your work is for our hiring loop, not for it.

---

## Ground rules

- ✅  AI assistants are fine. We use them too. Be ready to explain any line in your pairing session.
- ✅  Searching docs, copying patterns you understand — all fine.
- ❌  Don't copy another candidate's submission. We've seen most of them on GitHub already, and we always ask "why this choice" in the pairing session.
- 🕒  Honour the time-box. We respect your time and we'd rather see clear thinking in 4 hours than padded work in 12. **Tell us how long it took.**

---

## Stretch (only if you finished the core within the time-box)

Pick one. We read these for senior signal.

1. **Flake hunting.** Run your suite 10× in CI. Are any tests flaky? Fix one, write a sentence about why it flaked.
2. **CI workflow.** Add a `.github/workflows/ci.yml` that runs the app, your tests, and uploads results as an artifact. Parallelise sensibly.
3. **Test strategy doc.** Write a one-page `tests/STRATEGY.md` answering: "If you owned QA for this app for the next 6 months, what would you build / change / delete first, and why?"

---

## The pairing session

After we review your PR we'll book ~60 minutes to **pair on one new test together**, walk through the tests you already wrote, and have a broader conversation about QA. This is the part we weigh most heavily, the take-home is just the entry gate. Come ready to:

- Add a new test live, in your editor, in your stack of choice.
- Explain a trade-off you made.
- Tell us how you'd handle a flaky tests.
- Discuss general QA topics.

Good luck — and have fun with it. Reach out if anything in this spec is unclear; asking good questions is a positive signal.
