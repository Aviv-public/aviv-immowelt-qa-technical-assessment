using DemoTests.Base;
using DemoTests.Fixtures;
using DemoTests.Pages;

namespace DemoTests.Tests;

public class VisitorTests : BaseTest
{
    public VisitorTests(PlaywrightFixture fixture) : base(fixture) { }

    protected override bool RequiresLogin => false;

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_See_All_Properties(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: null,
                minPrice: null,
                maxPrice: null,
                propertyType: null,
                bedrooms: null);
            // Assert that 6 properties are found (as per the test data)
            await realEstatePage.AssertNumberOfPropertiesFoundAsync(6);
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_Filter_Properties_By_Location(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: "789",
                minPrice: null,
                maxPrice: null,
                propertyType: null,
                bedrooms: null);
            // Assert that 2 properties are found (as per the test data)
            await realEstatePage.AssertNumberOfPropertiesFoundAsync(2);
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_Filter_Properties_By_MinPrice(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: null,
                minPrice: "1000000",
                maxPrice: null,
                propertyType: null,
                bedrooms: null);
            // Assert that 4 properties are found (as per the test data)
            await realEstatePage.AssertNumberOfPropertiesFoundAsync(4);
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_Filter_Properties_By_MaxPrice(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: null,
                minPrice: null,
                maxPrice: "2000000",
                propertyType: null,
                bedrooms: null);
            // Assert that 5 properties are found (as per the test data)
            await realEstatePage.AssertNumberOfPropertiesFoundAsync(5);
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_Filter_Properties_By_Type(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: null,
                minPrice: null,
                maxPrice: null,
                propertyType: Enums.PropertyType.Commercial,
                bedrooms: null);
            // Assert that 1 properties are found (as per the test data)
            await realEstatePage.AssertNumberOfPropertiesFoundAsync(1);
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_Filter_Properties_By_NumberOfBedrooms(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: null,
                minPrice: null,
                maxPrice: null,
                propertyType: null,
                bedrooms: Enums.BedroomsCountType.ThreePlus);
            // Assert that 1 properties are found (as per the test data)
            await realEstatePage.AssertNumberOfPropertiesFoundAsync(1);
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Can_Filter_Properties_None_Found(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.SearchByFiltersAsync(
                location: "null",
                minPrice: null,
                maxPrice: null,
                propertyType: null,
                bedrooms: null);
            // Assert that no properties are found (as per the test data)
            await realEstatePage.AssertNoPropertiesFoundAsync();
        });
    }

    [Theory]
    [JsonFileData("Config/browsers.json", "Browsers")]
    public async Task Visitor_Cannot_Wishlist_Property_Moved_To_Login(string browser)
    {
        await RunAsync(browser, async () =>
        {
            var realEstatePage = new RealEstatePage(Page, Fixture.Settings);

            await realEstatePage.NavigateAsync();
            await realEstatePage.WishlistFirstFeaturedAsync();
            // Assert that the user is redirected to the login page
            await realEstatePage.AssertPropertyIsNotWishlistedAsync();
        });
    }




}