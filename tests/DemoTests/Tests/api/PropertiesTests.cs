using DemoTests.Base;
using DemoTests.Fixtures;
using DemoTests.Pages;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using System.Data;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Linq;

namespace DemoTests.Tests.API;

public class PropertiesTests : BaseAPITest
{
    public PropertiesTests(PlaywrightFixture fixture) : base(fixture) { }

    
    [Theory]
    [InlineData("sale","available", null, null, null, null, null, null, null, 5)]
    [InlineData(null, null, null, null, null, null, null, null, null, 6)]
    [InlineData(null, null, null, null, null, null, null, null, "price_asc", 6)]
    [InlineData(null, null, null, null, null, null, null, null, "price_desc", 6)]
    public async Task List_Properties(string? type, string? status, double? minPrice, double? maxPrice, int? bedrooms, double? bathrooms, string? location, string? q, string? sort, int expectedNumberOfProperties)
    {
        await RunAsync(async () =>
        {
            //Construct the URL params
            var urlBase = "/api/properties?";
            if (type != null) urlBase += $"type={type}&";
            if (status != null) urlBase += $"status={status}&";
            if (minPrice != null) urlBase += $"minPrice={minPrice.Value}&";
            if (maxPrice != null) urlBase += $"maxPrice={maxPrice.Value}&";
            if (bedrooms != null) urlBase += $"bedrooms={bedrooms.Value}&";
            if (bathrooms != null) urlBase += $"bathrooms={bathrooms.Value}&";
            if (location != null) urlBase += $"location={location}&";
            if (q != null) urlBase += $"q={q}&";
            if (sort != null) urlBase += $"sort={sort}&";

            // call GET /api/auth/me to get the user data
            var listPropertiesResponse = await Fixture.ApiRequestContext.GetAsync(urlBase, new()
            {
                
            });

            await Expect(listPropertiesResponse).ToBeOKAsync();
            var properties = await listPropertiesResponse.JsonAsync();
            var count = properties?.GetArrayLength() ?? 0;
            Assert.Equal(expectedNumberOfProperties, count);

            //Verift the sorting if sort parameter is provided
            if (sort != null && count > 1)
            {
                var prices = properties?.EnumerateArray().Select(p => p.GetProperty("price").GetDouble()).ToList() ?? new List<double>();
                var sortedPrices = sort == "price_asc" ? prices.OrderBy(p => p).ToList() : prices.OrderByDescending(p => p).ToList();
                Assert.Equal(sortedPrices, prices);
            }
        });
    }

    [Theory]
    [InlineData("price_description", "\"Invalid enum value. Expected 'price_asc' | 'price_desc' | 'newest' | 'oldest', received 'price_description'\"")]
    public async Task List_Properties_Invalid_Sorting(string? sort, string expectedErrorMessage)
    {
        await RunAsync(async () =>
        {
            //Construct the URL params
            var urlBase = "/api/properties?";
            if (sort != null) urlBase += $"sort={sort}&";

            // call GET /api/auth/me to get the user data
            var listPropertiesResponse = await Fixture.ApiRequestContext.GetAsync(urlBase, new()
            {

            });

            await Expect(listPropertiesResponse).Not.ToBeOKAsync();
            var errorJson = await listPropertiesResponse.JsonAsync();
            var errorMessage = errorJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal("Validation failed", errorMessage);
            var validationError = errorJson?.GetProperty("details").GetProperty("sort").EnumerateArray().Select(x => x.GetRawText()).FirstOrDefault() ?? "";
            Assert.Equal(expectedErrorMessage, validationError);

        });
    }


}