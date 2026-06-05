using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace DemoTests.Config;

public class TestSettings
{
    public bool Headed { get; init; } = false;

    public string TestBaseUrl { get; init; } = string.Empty;
    public string APIBaseUrl { get; init; } = string.Empty;
    public string TestUsername { get; init; } = string.Empty;
    public string TestPassword { get; init; } = string.Empty;
    public string AgentUsername { get; init; } = string.Empty;
    public string AgentPassword { get; init; } = string.Empty;
    public string AdminUsername { get; init; } = string.Empty;
    public string AdminPassword { get; init; } = string.Empty;

    public static TestSettings Load()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("Config/appsettings.Test.json", optional: false, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        return configuration
                   .GetSection("TestSettings")
                   .Get<TestSettings>()
               ?? throw new InvalidOperationException("Could not load TestSettings");
    }
}

