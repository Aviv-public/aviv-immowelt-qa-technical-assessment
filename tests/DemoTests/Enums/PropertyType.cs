using System;
using System.Collections.Generic;
using System.Text;

namespace DemoTests.Enums;

public class PropertyType
{
    private PropertyType(string value) { Value = value; }

    public string Value { get; private set; }

    public static PropertyType All { get; } = new("");
    public static PropertyType ForSale { get; } = new("sale");

    public static PropertyType ForRent { get; } = new("rent");
    public static PropertyType Commercial { get; } = new("commercial");

    public override string ToString() => Value;
}
