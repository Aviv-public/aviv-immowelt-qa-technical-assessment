using Microsoft.Playwright;
using DemoTests.Auth;
using DemoTests.Fixtures;
using Microsoft.Playwright.Xunit;

namespace DemoTests.Base;

public abstract class BaseAPITest : PlaywrightTest, IClassFixture<PlaywrightFixture>
{
    protected readonly PlaywrightFixture Fixture;


    protected BaseAPITest(PlaywrightFixture fixture)
    {
        Fixture = fixture;
        
    }

    protected virtual bool RequiresLogin => true;

    new protected async Task InitializeAsync()
    {
        try
        {
            await Fixture.InitializeAsync();

            if (RequiresLogin)
            {
                Console.WriteLine("[INIT] Log in with starred credentials using API...");

                var loginData = new
                {
                    email = Fixture.Settings.TestUsername,
                    password = Fixture.Settings.TestPassword
                };
                var loginResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/login", new() { DataObject = loginData });
                await Expect(loginResponse).ToBeOKAsync();
                var loginJson = await loginResponse.JsonAsync();
                var userLoginToken = loginJson?.GetProperty("token").GetString() ?? "";

                // Set the bearer token in the header to authenticate the request
                await Fixture.InitializeAPIRequestContextAsync(userLoginToken);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("API INITIALIZATION FAILED:");
            Console.WriteLine(ex);

            throw;
        }
    }

    protected async Task RunAsync(Func<Task> test)
    {
        try
        {
            await InitializeAsync();

            await test();
        }
        catch (Exception ex)
        {
            

            Console.WriteLine($"API Test failed");
            Console.WriteLine(ex);

            throw;
        }
        finally
        {
            //More cleanup if needed
            
        }
    }
}
