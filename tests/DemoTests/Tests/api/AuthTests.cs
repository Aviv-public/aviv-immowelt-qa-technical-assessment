using DemoTests.Base;
using DemoTests.Fixtures;
using DemoTests.Pages;
using Microsoft.Playwright;
using Microsoft.Playwright.Xunit;
using System.Text.Json.Nodes;

namespace DemoTests.Tests.API;

public class AuthTests : BaseAPITest
{
    public AuthTests(PlaywrightFixture fixture) : base(fixture) { }

    protected override bool RequiresLogin => false;

    private Dictionary<string, string> NewUserData = new Dictionary<string, string>
    {
        { "name", "API User" },
        { "email", "user@example.com" },
        { "password", "Test123!" },
        { "phone", "555-5555-54534" },
        { "role", "user" }
    };

    [Fact]
    public async Task User_Registration_RoundTrip()
    {
        await RunAsync(async () =>
        {
            // Register new user
            

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var userToken = registerJson?.GetProperty("token").GetString() ?? "";
            var userData = registerJson?.GetProperty("user").GetRawText();

            //Log in with new user
            var loginData = new
            {
                email = "user@example.com",
                password = "Test123!"
            };
            var loginResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/login", new() { DataObject = loginData });
            await Expect(loginResponse).ToBeOKAsync();
            var loginJson = await loginResponse.JsonAsync();
            var userLoginToken = loginJson?.GetProperty("token").GetString() ?? "";
            var loggedInUserData = loginJson?.GetProperty("user").GetRawText();
            Assert.Equal(userData, loggedInUserData);

            // Set the bearer token in the header to authenticate the request
            await Fixture.InitializeAPIRequestContextAsync(userLoginToken);

            // call GET /api/auth/me to get the user data
            var meResponse = await Fixture.ApiRequestContext.GetAsync("/api/auth/me");
            await Expect(meResponse).ToBeOKAsync();
            var meJson = await meResponse.JsonAsync();
            var meUserData = meJson?.GetProperty("user").GetRawText();
            Assert.Equal(userData, meUserData);


        });
    }

    [Theory]
    [InlineData("A", "\"String must contain at least 2 character(s)\"")]
    [InlineData(" ", "\"String must contain at least 2 character(s)\"")]
    public async Task User_Registration_Fail_InvalidName(string name, string expectedMessage)
    {
        await RunAsync(async () =>
        {
            // Set NewUserData name field to 'A'
            NewUserData["name"] = name;

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).Not.ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var errorMessage = registerJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal("Validation failed", errorMessage);
            var validationError = registerJson?.GetProperty("details").GetProperty("name").EnumerateArray().Select(x => x.GetRawText()).FirstOrDefault() ?? "";
            Assert.Equal(expectedMessage, validationError);

        });
    }

    [Theory]
    [InlineData("invalid-email", "\"Invalid email\"")]
    [InlineData("", "\"Invalid email\"")]
    public async Task User_Registration_Fail_InvalidEmail(string email, string expectedMessage)
    {
        await RunAsync(async () =>
        {
            // Set NewUserData email field to invalid email
            NewUserData["email"] = email;

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).Not.ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var errorMessage = registerJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal("Validation failed", errorMessage);
            var validationError = registerJson?.GetProperty("details").GetProperty("email").EnumerateArray().Select(x => x.GetRawText()).FirstOrDefault() ?? "";
            Assert.Equal(expectedMessage, validationError);

        });
    }

    [Theory]
    [InlineData("A12", "\"Password must be at least 8 characters\"")]
    [InlineData("fsdaabdecefa", "\"Password must contain at least one uppercase letter\"")]
    [InlineData("AFdaabdecefa", "\"Password must contain at least one number\"")]
    [InlineData("1AFdaabdecefa", "\"Password must contain at least one special character\"")]
    public async Task User_Registration_Fail_InvalidPassword(string password, string expectedMessage)
    {
        await RunAsync(async () =>
        {
            // Set NewUserData password field to invalid password
            NewUserData["password"] = password;

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).Not.ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var errorMessage = registerJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal("Validation failed", errorMessage);
            var validationError = registerJson?.GetProperty("details").GetProperty("password").EnumerateArray().Select(x => x.GetRawText()).FirstOrDefault() ?? "";
            Assert.Equal(expectedMessage, validationError);

        });
    }

    [Theory]
    [InlineData("invalid-phone", "\"Invalid phone number\"")]
    [InlineData("", "\"String must contain at least 10 character(s)\"")]
    [InlineData("555-", "\"String must contain at least 10 character(s)\"")]
    public async Task User_Registration_Fail_InvalidPhone(string phone, string expectedMessage)
    {
        await RunAsync(async () =>
        {
            // Set NewUserData phone field to invalid phone
            NewUserData["phone"] = phone;

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).Not.ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var errorMessage = registerJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal("Validation failed", errorMessage);
            var validationError = registerJson?.GetProperty("details").GetProperty("phone").EnumerateArray().Select(x => x.GetRawText()).FirstOrDefault() ?? "";
            Assert.Equal(expectedMessage, validationError);

        });
    }

    [Theory]
    [InlineData("admin", "\"Invalid enum value. Expected 'user' | 'agent', received 'admin'\"")]
    [InlineData("", "\"Invalid enum value. Expected 'user' | 'agent', received ''\"")]
    [InlineData("Superuser", "\"Invalid enum value. Expected 'user' | 'agent', received 'Superuser'\"")]
    public async Task User_Registration_Fail_InvalidRole(string role, string expectedMessage)
    {
        await RunAsync(async () =>
        {
            // Set NewUserData role field to invalid role
            NewUserData["role"] = role;

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).Not.ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var errorMessage = registerJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal("Validation failed", errorMessage);
            var validationError = registerJson?.GetProperty("details").GetProperty("role").EnumerateArray().Select(x => x.GetRawText()).FirstOrDefault() ?? "";
            Assert.Equal(expectedMessage, validationError);

        });
    }

    [Theory]
    [InlineData("test@example.com", "Email already registered")]
    public async Task User_Registration_Fail_DuplicateEmail(string email, string expectedMessage)
    {
        await RunAsync(async () =>
        {
            // Set NewUserData email field to invalid email
            NewUserData["email"] = email;

            var registerResponse = await Fixture.ApiRequestContext.PostAsync("/api/auth/register", new() { DataObject = NewUserData });
            await Expect(registerResponse).Not.ToBeOKAsync();
            var registerJson = await registerResponse.JsonAsync();
            var errorMessage = registerJson?.GetProperty("error").GetString() ?? "";
            Assert.Equal(expectedMessage, errorMessage);

        });
    }


}