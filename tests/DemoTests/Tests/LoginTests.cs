using DemoTests.Base;
using DemoTests.Fixtures;
using DemoTests.Pages;

namespace DemoTests.Tests;

public class LoginTests : BaseTest
{
    public LoginTests(PlaywrightFixture fixture) : base(fixture) { }

    protected override bool RequiresLogin => false;

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Invalid_password_should_fail(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var login = new LoginPage(Page, Fixture.Settings);

            await login.NavigateAsync();
            await login.LoginAsync(Fixture.Settings.TestUsername, "wrong123!");

            await login.AssertLoginFailed();
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Valid_credentials_should_succeed(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var login = new LoginPage(Page, Fixture.Settings);

            await login.NavigateAsync();
            await login.LoginAsync(
                Fixture.Settings.TestUsername,
                Fixture.Settings.TestPassword);

            await login.AssertLoginSuccessful();
        });
    }
}