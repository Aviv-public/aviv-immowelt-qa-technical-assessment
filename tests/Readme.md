# Aviv Immowelt Tests

## What was built
The solution beforehand represents a demonstration of the testing structure one can use to test E2E and API tests.
It was built using xUnit, .NET 10 and Playwright. Playwright is used for both E2E and API tests, as it has a built in API testing framework. 
The solution is structured in a way that allows for easy maintenance and scalability, with clear separation of concerns between the different layers of the testing framework.
Some of the key features are:
- Page Object Model
- Test Data Management inline data
- Login session save and reuse across tests (no relogin required for each test)
- Parallel test execution and multi-browser support
- Automatic creation of trace files and screenshot on test failure

## How to run it
Use the provided ci.yml on github actions or run the following steps:
- Clone the repository
- Install dotnet if needed
    - ```bash
      curl -L https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
      ```
    - ```bash
      chmod +x ./dotnet-install.sh
      ```
    - ```bash
      ./dotnet-install.sh --version latest
      ```
- Start the application from the root folder
    - ```bash
      npm install
      ```
    - ```bash
      npm run dev
      ```
- Navigate to the project directory and run the tests using the following command:
    - ```bash
      dotnet restore
      ```      
    - ```bash
      .\bin\Debug\net10.0\playwright.ps1 install
      ```
    - ```bash
      dotnet test --logger trx -- xunit.parallelizeAssembly=true xunit.maxParallelThreads=2
      ```

### Expected results
Keep note that some tests will fail due possible bugs in the product tested. 
It is expected that the follwing tests will fail:
- ``` Visitor_Can_Filter_Properties_By... ``` : Those tests will fail because after filtering the filter results counter is not updated and still shows 6 results instead of the expected ones
- ``` User_Registration_Fail_InvalidPhone ``` : This test will fail is a string is passed containing no numbers. It is expected to fail (not a valid phone number) but the app returns success (200)

## What was skipped
Due to time constraints, I had to skip some optimizations for the API testing architecture and tests. There is room for improvement, especially in handling common data and some code duplication.
Also, the API test for Favoriting a property is not clean enough and needs to be refactored soon. That is a trade off I had to make in order to have a working test for that feature, but it is not ideal and should be improved.

## What to do next with another 4 hours
First thing I'd open 2 bugs for the DEV team to check and fix if needed (regarding the filter results counter and the phone number validation).
Then, I'd refactor the API tests to ensure better test isolation and maintainability.
First thing would be to refactor the API parallelization, ideally to run each test with its own user session. That way we'd ensure complete test isolation.
For that we'd need some helper classes to set up and tear down tests. On setup to create a new user and log in, on teardown to delete the user or other data necessary.




