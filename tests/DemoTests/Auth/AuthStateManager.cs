using Microsoft.Playwright;
using DemoTests.Config;
using DemoTests.Pages;

namespace DemoTests.Auth;

public static class AuthStateManager
{
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public static async Task<string> GetStorageStateAsync(
        IBrowser browser,
        TestSettings settings,
        string browserName)
    {
        var fileName = $"auth-{browserName}.json";
        var path = Path.Combine(Path.GetTempPath(), fileName);

        if (File.Exists(path))
            return path;

        await _lock.WaitAsync();
        try
        {
            if (File.Exists(path))
                return path;

            var context = await browser.NewContextAsync();
            var page = await context.NewPageAsync();

            var loginPage = new LoginPage(page, settings);

            await loginPage.NavigateAsync();
            await loginPage.LoginAsync(settings.TestUsername, settings.TestPassword);
            await loginPage.AssertLoginSuccessful();

            await context.StorageStateAsync(new()
            {
                Path = path
            });

            await context.CloseAsync();

            return path;
        }
        finally
        {
            _lock.Release();
        }
    }
}
