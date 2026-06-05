using DemoTests.Base;
using DemoTests.Fixtures;
using DemoTests.Pages;

namespace DemoTests.Tests;

public class DashboardTests : BaseTest
{
    public DashboardTests(PlaywrightFixture fixture) : base(fixture) { }


    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task User_Can_Wishlist_Property(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var dashboardPage = new DashboardPage(Page, Fixture.Settings);

            await dashboardPage.NavigateAsync();
            int previousCount = await dashboardPage.GetDashboardSavedPropertiesCountAsync();

            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);
            await realEstatePage.NavigateAsync();
            await realEstatePage.WishlistFirstFeaturedAsync();

            //Now back to dashboard to check if the property is added to wishlist
            await dashboardPage.NavigateAsync();
            await dashboardPage.AssertPropertyWishlisted(previousCount);


        });
    }

}