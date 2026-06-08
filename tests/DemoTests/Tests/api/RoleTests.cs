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

public class RoleTests : BaseAPITest
{
    public RoleTests(PlaywrightFixture fixture) : base(fixture) { }

    protected override bool RequiresLogin => false;

    [Theory]
    [InlineData("user", false)]
    [InlineData("agent", false)]
    [InlineData("admin", true)]
    public async Task List_Users(string role, bool expectedResult)
    {
        await RunAsync(async () =>
        {
            await UserLogin(role);

            // call GET /api/auth/me to get the user data
            var listUsersResponse = await Fixture.ApiRequestContext.GetAsync("/api/users");
            if(expectedResult)
            {
                await Expect(listUsersResponse).ToBeOKAsync();
            }
            else
            {
                await Expect(listUsersResponse).Not.ToBeOKAsync();
                var errorJson = await listUsersResponse.JsonAsync();
                var errorMessage = errorJson?.GetProperty("error").GetString() ?? "";
                Assert.Equal("Forbidden", errorMessage);
            }
        });
    }

    [Theory]
    [InlineData("user", false)]
    [InlineData("agent", true)]
    [InlineData("admin", true)]
    public async Task Create_Property(string role, bool expectedResult)
    {
        await RunAsync(async () =>
        {
            await UserLogin(role);

            var propertyPayload = new
            {
                title = "Luxury Apartment",
                description = "Spacious 2-bedroom downtown apartment.",
                price = 450000,
                location = new
                {
                    address = "123 Main Street",
                    city = "Austin",
                    state = "TX",
                    zipCode = "78701"
                },
                features = new
                {
                    bedrooms = 2,
                    bathrooms = 2,
                    area = 1200,
                    yearBuilt = 2021
                },
                type = "sale",
                status = "available"
            };

            // call GET /api/auth/me to get the user data
            var createPropertyResponse = await Fixture.ApiRequestContext.PostAsync("/api/properties", new() { DataObject = propertyPayload });
            if (expectedResult)
            {
                await Expect(createPropertyResponse).ToBeOKAsync();
                var responseJson = await createPropertyResponse.JsonAsync();
                var agentEmail = responseJson?.GetProperty("agent").GetProperty("email").GetString() ?? "";
                var expectedAgentEmail = role == "admin" ? Fixture.Settings.AdminUsername : Fixture.Settings.AgentUsername;
                Assert.Equal(expectedAgentEmail, agentEmail);
            }
            else
            {
                await Expect(createPropertyResponse).Not.ToBeOKAsync();
                var errorJson = await createPropertyResponse.JsonAsync();
                var errorMessage = errorJson?.GetProperty("error").GetString() ?? "";
                Assert.Equal("Forbidden", errorMessage);
            }
        });
    }

    [Theory]
    [InlineData("user", false, false, false)]
    [InlineData("agent", false, false, false)]
    [InlineData("admin", true, true, true)]
    public async Task Can_Update_User(string role, bool expectedUserResult, bool expectedAgentResult, bool expectedAdminResult)
    {
        await RunAsync(async () =>
        {
            //Prepare data
            await UserLogin("admin");
            var listUsersResponse = await Fixture.ApiRequestContext.GetAsync("/api/users");
            await Expect(listUsersResponse).ToBeOKAsync();
            JsonElement listUsersJson = await listUsersResponse.JsonAsync() ?? default;
            var testUserID = listUsersJson.EnumerateArray().FirstOrDefault(u => u.GetProperty("email").GetString() == Fixture.Settings.TestUsername).GetProperty("id").GetString() ?? "";
            var agentUserID = listUsersJson.EnumerateArray().FirstOrDefault(u => u.GetProperty("email").GetString() == Fixture.Settings.AgentUsername).GetProperty("id").GetString() ?? "";
            var adminUserID = listUsersJson.EnumerateArray().FirstOrDefault(u => u.GetProperty("email").GetString() == Fixture.Settings.AdminUsername).GetProperty("id").GetString() ?? "";

            await UserLogin(role);

            var userUpdateData = new
            {
                name = "DEMO USER!",
            };

            // Put new user data with different roles and verify results
            var putNewUserDataResponse = await Fixture.ApiRequestContext.PutAsync($"/api/users/{testUserID}", new() { DataObject = userUpdateData });
            if (expectedUserResult)
            {
                await Expect(putNewUserDataResponse).ToBeOKAsync();
            }
            else
            {
                await Expect(putNewUserDataResponse).Not.ToBeOKAsync();
            }

            putNewUserDataResponse = await Fixture.ApiRequestContext.PutAsync($"/api/users/{agentUserID}", new() { DataObject = userUpdateData });
            if (expectedAgentResult)
            {
                await Expect(putNewUserDataResponse).ToBeOKAsync();
            }
            else
            {
                await Expect(putNewUserDataResponse).Not.ToBeOKAsync();
            }

            putNewUserDataResponse = await Fixture.ApiRequestContext.PutAsync($"/api/users/{adminUserID}", new() { DataObject = userUpdateData });
            if (expectedAdminResult)
            {
                await Expect(putNewUserDataResponse).ToBeOKAsync();
            }
            else
            {
                await Expect(putNewUserDataResponse).Not.ToBeOKAsync();
            }
        });
    }


    private async Task UserLogin(string role)
    {
        var userEmail = Fixture.Settings.TestUsername;
        switch (role)
        {
            case "agent":
                userEmail = Fixture.Settings.AgentUsername;
                break;
            case "admin":
                userEmail = Fixture.Settings.AdminUsername;
                break;
        }

        var loginData = new
        {
            email = userEmail,
            password = "Test123!"
        };
        var loginResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/login", new() { DataObject = loginData });
        await Expect(loginResponse).ToBeOKAsync();
        var loginJson = await loginResponse.JsonAsync();
        var userLoginToken = loginJson?.GetProperty("token").GetString() ?? "";

        // Set the bearer token in the header to authenticate the request
        await Fixture.InitializeAPIRequestContextAsync(userLoginToken);
    }
}