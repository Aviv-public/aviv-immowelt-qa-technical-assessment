using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using DemoTests.Config;
using DemoTests.Enums;

namespace DemoTests.Pages;

public class RealEstatePage : PageTest
{
    private readonly IPage _page;
    private readonly TestSettings _settings;

    public RealEstatePage(IPage page, TestSettings settings)
    {
        _page = page;
        _settings = settings;
    }

    public async Task NavigateAsync()
    {
        await _page.GotoAsync($"{_settings.TestBaseUrl}");
        await Expect(_page.GetByRole(AriaRole.Heading, new() { Name = "Find Your Dream Property" })).ToBeVisibleAsync();
    }

    public async Task SearchByFiltersAsync(string? location, string? minPrice, string? maxPrice, PropertyType? propertyType, BedroomsCountType? bedrooms)
    {
        var locationLocator = _page.GetByRole(AriaRole.Textbox, new() { Name = "Location" });
        var minPriceLocator = _page.GetByPlaceholder("Min Price (€)");
        var maxPriceLocator = _page.GetByPlaceholder("Max Price (€)");
        var propertyTypeLocator = _page.Locator("select[name=\"type\"]");
        var bedroomsLocator = _page.Locator("select[name=\"bedrooms\"]");

        await _page.GetByRole(AriaRole.Button, new() { Name = "Reset" }).ClickAsync();

        if (location != null)
        {
            await locationLocator.ClickAsync();
            await locationLocator.FillAsync(location);
        }

        if (minPrice != null)
        {
            await minPriceLocator.ClickAsync();
            await minPriceLocator.FillAsync(minPrice);
        }

        if (maxPrice != null)
        {
            await maxPriceLocator.ClickAsync();
            await maxPriceLocator.FillAsync(maxPrice);
        }

        if (propertyType != null)
        {
            await propertyTypeLocator.SelectOptionAsync(propertyType.Value);
        }

        if (bedrooms != null)
        {
            await bedroomsLocator.SelectOptionAsync(bedrooms.Value);
        }

        await _page.GetByRole(AriaRole.Button, new() { Name = "Search Properties" }).ClickAsync();
    }
  
    public async Task AssertNumberOfPropertiesFoundAsync(int expectedCount)
    {
        //Assert the number of property cards
        var propertiesLocator = _page.Locator("//*[@id=\"root\"]/div/main/div/div[4]/div[2]/div");
        await Expect(propertiesLocator).ToHaveCountAsync(expectedCount);

        //Assert the text summary of results
        var filterSummaryLocator = _page.GetByText("properties found");
        await Expect(filterSummaryLocator).ToBeVisibleAsync();
        await Expect(filterSummaryLocator).ToContainTextAsync($"{expectedCount} properties found");
    }

    public async Task AssertNoPropertiesFoundAsync()
    {
        //Assert the number of property cards
        var propertiesLocator = _page.Locator("//*[@id=\"root\"]/div/main/div/div[4]/div[2]/div");
        await Expect(propertiesLocator).ToBeHiddenAsync();

        //Assert the text summary of results
        await Expect(_page.GetByText("No properties match your search criteria.Try adjusting your filters or search")).ToBeVisibleAsync();
        await Expect(_page.GetByRole(AriaRole.Main)).ToContainTextAsync("No properties match your search criteria.Try adjusting your filters or search terms.");

    }

    public async Task WishlistFirstFeaturedAsync()
    {
        await _page.GetByRole(AriaRole.Button).Nth(2).ClickAsync();        
    }

    public async Task AssertPropertyIsWishlistedAsync(int count)
    {
        //Navigate to /Dashboard and assert the property count is in the wishlist
    }

    public async Task AssertPropertyIsNotWishlistedAsync()
    {
        // Visitor is redirected to login page when trying to wishlist a property, so we can assert the user is not logged in by checking for the presence of the login form
        await _page.WaitForURLAsync("**/login");
        await Expect(_page.GetByRole(AriaRole.Heading, new() { Name = "Sign in to your account" })).ToBeVisibleAsync();

    }
}

