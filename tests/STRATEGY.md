# QA Roadmap for next 6 months

Let's break down the QA roadmap for the next 6 months into key focus areas and milestones:
- Set up a CI/CD pipeline for automated testing
- Expand test coverage to include more E2E and API tests
- Categorize tests into smoke, regression, and performance tests
- Run smoke tests on every commit, regression tests on a daily basis, and performance tests on a weekly basis
- Automate reporting and notifications for test results (i.e. send out emails or Slack messages for test failures)
- Shift-left approach: Collaborate with the development team to integrate testing earlier in the development process, ensuring that tests are created alongside new features and bug fixes
    - API tests should be created as part of the development process for new features, ensuring that they are tested from the start
    - Ensure DEV team has time per sprint to add more coverage of API testing
    - Do a workshop with the DEV team to share best practices for testing and how to write good tests, especially for E2E testing
    - E2E tests should be written for new features by the DEV team with support from QA Automation team (coaching, code reviews, creating the needed infrastructure like page objects, etc.)
- Document everything: Create and maintain documentation for the testing framework, test cases, and best practices to ensure knowledge sharing and onboarding of new team members (internal Wiki)

## Suggested Timeline:
- Month 1: Set up CI/CD pipeline, categorize tests, and automate reporting
- Month 2-3: Expand test coverage and implement shift-left approach with the development team
- Month 4-5: Continue expanding test coverage, run tests according to the defined schedule, and conduct workshops with the development team
- Month 6: Review and optimize the testing strategy, update documentation, and plan for the next phase of testing improvements
- Ongoing: Monitor test results, write documentation, provide feedback to the development team, and continuously improve the testing process based on feedback and changing requirements.

