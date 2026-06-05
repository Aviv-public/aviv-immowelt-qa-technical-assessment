using Microsoft.Playwright;
using DemoTests.Config;

namespace DemoTests.Fixtures;

public class PlaywrightFixture : IAsyncLifetime
{
    public IPlaywright Playwright { get; private set; } = null!;
    public TestSettings Settings { get; private set; } = null!;

    private readonly Dictionary<string, IBrowser> _browsers = new();

    public async Task InitializeAsync()
    {
        CleanupArtifacts();
        
        Settings = TestSettings.Load();
        Playwright = await Microsoft.Playwright.Playwright.CreateAsync();

        // TODO: Clean up the APP using API endpoint /api/test/reset

    }

    private void CleanupArtifacts()
    {
        var temp = Path.GetTempPath();

        //Clean up any existing auth states from previous test runs to ensure clean slate for tests and avoid confusion when debugging
        foreach (var file in Directory.GetFiles(temp, "auth-*.json"))
        {
            try
            {
                File.Delete(file);
                Console.WriteLine($"Deleted auth state: {file}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Could not delete {file}");
                Console.WriteLine(ex);
            }
        }

        //Clear the folder
        var artifactsDir = Path.Combine(AppContext.BaseDirectory, "artifacts");

        if (Directory.Exists(artifactsDir))
        {
            try
            {
                Directory.Delete(artifactsDir, recursive: true);
                Console.WriteLine("Deleted artifacts directory");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Could not delete artifacts directory");
                Console.WriteLine(ex);
            }
        }

        Directory.CreateDirectory(artifactsDir);
    }

    public async Task<IBrowser> GetBrowserAsync(string browserName)
    {
        if (_browsers.ContainsKey(browserName))
            return _browsers[browserName];

        var browser = await BrowserFactory.LaunchAsync(
            Playwright,
            browserName,
            Settings.Headed);

        _browsers[browserName] = browser;
        return browser;
    }

    public async Task DisposeAsync()
    {
        foreach (var browser in _browsers.Values)
            await browser.CloseAsync();

        Playwright.Dispose();
    }
}
