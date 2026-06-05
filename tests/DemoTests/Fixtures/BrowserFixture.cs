using Microsoft.Playwright;

namespace DemoTests.Fixtures;

public static class BrowserFactory
{
    public static async Task<IBrowser> LaunchAsync(
        IPlaywright playwright,
        string browserName,
        bool headed)
    {
        var options = new BrowserTypeLaunchOptions
        {
            Headless = !headed,  
        };

        return browserName.ToLower() switch
        {
            "chromium" => await playwright.Chromium.LaunchAsync(options),

            "firefox" => await playwright.Firefox.LaunchAsync(options),

            "edge" => await playwright.Chromium.LaunchAsync(new()
            {
                Channel = "msedge",
                Headless = !headed
            }),

            _ => throw new ArgumentException($"Unknown browser: {browserName}")
        };
    }
}