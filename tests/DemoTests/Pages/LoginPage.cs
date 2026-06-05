using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using DemoTests.Config;

namespace DemoTests.Pages;

public class LoginPage : PageTest
{
    private readonly IPage _page;
    private readonly TestSettings _settings;

    public LoginPage(IPage page, TestSettings settings)
    {
        _page = page;
        _settings = settings;
    }

    public async Task NavigateAsync()
    {
        await _page.GotoAsync($"{_settings.TestBaseUrl}/login");
        await Expect(_page.GetByRole(AriaRole.Heading, new() { Name = "Sign in to your account" })).ToBeVisibleAsync();
    }

    public async Task LoginAsync(string username, string password)
    {
        var usernameLocator = _page.Locator("input[name=\"email\"]");
        var passwordLocator = _page.Locator("input[name=\"password\"]");

        await usernameLocator.ClickAsync();
        await usernameLocator.FillAsync(username);

        await passwordLocator.ClickAsync();
        await passwordLocator.FillAsync(password);

        await _page.GetByRole(AriaRole.Button, new() { Name = "Sign in" }).ClickAsync();
    }

    public async Task AssertLoginSuccessful()
    {
        await _page.WaitForURLAsync("**/dashboard");
        await Expect(_page.GetByRole(AriaRole.Heading, new() { Name = "My Dashboard" })).ToBeVisibleAsync();
    }

    public async Task AssertLoginFailed()
    {
        await Expect(_page.GetByText("Invalid email or password")).ToBeVisibleAsync();
    }
}

