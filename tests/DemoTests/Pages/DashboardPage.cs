using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using DemoTests.Config;
using DemoTests.Enums;

namespace DemoTests.Pages;

public class DashboardPage : PageTest
{
    private readonly IPage _page;
    private readonly TestSettings _settings;

    public DashboardPage(IPage page, TestSettings settings)
    {
        _page = page;
        _settings = settings;
    }

    public async Task NavigateAsync()
    {
        await _page.GotoAsync($"{_settings.TestBaseUrl}/dashboard");
        await Expect(_page.GetByRole(AriaRole.Heading, new() { Name = "My Dashboard" })).ToBeVisibleAsync();
    }

    public async Task<int> GetDashboardSavedPropertiesCountAsync()
    {

        var dashboardCardsLocator = _page.Locator("//*[@id=\"root\"]/div/main/div/div/div/div");
        await Expect(dashboardCardsLocator).ToHaveCountAsync(3);

        var savedPropertiesCountLocator = dashboardCardsLocator.Nth(0).Locator("p");
        var text = await savedPropertiesCountLocator.TextContentAsync();
        
        return int.Parse(text ?? "-1");

    }

    public async Task AssertPropertyWishlisted(int previousCount)
    {
        var dashboardCardsLocator = _page.Locator("//*[@id=\"root\"]/div/main/div/div/div/div");
        var savedPropertiesCountLocator = dashboardCardsLocator.Nth(0).Locator("p");
        await Expect(savedPropertiesCountLocator).ToContainTextAsync((previousCount + 1).ToString());

        await Expect(_page.Locator("h2")).ToBeVisibleAsync();
        await Expect(_page.Locator("h2")).ToContainTextAsync("Saved Properties");
        await Expect(_page.GetByRole(AriaRole.Link, new() { Name = "Modern Luxury Villa" })).ToBeVisibleAsync();
    }
}

