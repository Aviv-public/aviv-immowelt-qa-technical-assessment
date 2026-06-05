using Microsoft.Playwright;
using DemoTests.Auth;
using DemoTests.Fixtures;

namespace DemoTests.Base;

public abstract class BaseTest : IClassFixture<PlaywrightFixture>
{
    protected readonly PlaywrightFixture Fixture;

    protected IBrowser Browser = null!;
    protected IBrowserContext Context = null!;
    protected IPage Page = null!;

    protected BaseTest(PlaywrightFixture fixture)
    {
        Fixture = fixture;
        
    }

    protected virtual bool RequiresLogin => true;

    protected async Task InitializeAsync(string browserName)
    {
        try
        {
            Console.WriteLine($"[INIT] Starting test for browser: {browserName}");

            if (Fixture.Playwright == null)
                throw new InvalidOperationException("Playwright is not initialized");

            if (Fixture.Settings == null)
                throw new InvalidOperationException("Settings are not loaded");

            Browser = await Fixture.GetBrowserAsync(browserName);

            if (Browser == null)
                throw new Exception("Browser failed to launch");

            var options = new BrowserNewContextOptions();

            if (RequiresLogin)
            {
                Console.WriteLine("[INIT] Loading auth state...");

                var storage = await AuthStateManager.GetStorageStateAsync(
                    Browser,
                    Fixture.Settings,
                    browserName);

                options.StorageStatePath = storage;
            }

            Context = await Browser.NewContextAsync(options);

            if (Context == null)
                throw new Exception("Context creation failed");

            Page = await Context.NewPageAsync();

            if (Page == null)
                throw new Exception("Page creation failed");

            Console.WriteLine("[INIT] Initialization complete");
        }
        catch (Exception ex)
        {
            Console.WriteLine("INITIALIZATION FAILED:");
            Console.WriteLine(ex);

            throw;
        }
    }

    protected async Task RunAsync(string browser, Func<Task> test)
    {
        string? tracePath = null;

        try
        {
            await InitializeAsync(browser);

            await Context.Tracing.StartAsync(new()
            {
                Screenshots = true,
                Snapshots = true,
                Sources = true
            });

            await test();
        }
        catch (Exception ex)
        {
            var artifactsDir = Path.Combine(AppContext.BaseDirectory, "artifacts");
            Directory.CreateDirectory(artifactsDir);

            if (Page != null)
            {
                var screenshot = Path.Combine(
                    artifactsDir,
                    $"error-{browser}-{Guid.NewGuid()}.png");

                await Page.ScreenshotAsync(new()
                {
                    Path = screenshot,
                    FullPage = true
                });

                Console.WriteLine($"Screenshot: {screenshot}");
            }

            if (Context != null)
            {
                tracePath = Path.Combine(
                    artifactsDir,
                    $"trace-{browser}-{Guid.NewGuid()}.zip");



                await Context.Tracing.StopAsync(new()
                {
                    Path = tracePath
                });

                Console.WriteLine($"Trace: {tracePath}");

                await Context.CloseAsync();
            }

            Console.WriteLine($"Test failed on {browser}");
            Console.WriteLine(ex);

            throw;
        }
        finally
        {
            //More cleanup if needed
            
        }
    }
}
