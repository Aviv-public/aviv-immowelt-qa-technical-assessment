using System;
using System.Collections.Generic;
using System.Text;

namespace DemoTests.Enums;

public class BedroomsCountType
{
    private BedroomsCountType(string value) { Value = value; }

    public string Value { get; private set; }

    public static BedroomsCountType All { get; } = new("");
    public static BedroomsCountType OnePlus { get; } = new("1");
    public static BedroomsCountType TwoPlus { get; } = new("2");
    public static BedroomsCountType ThreePlus { get; } = new("3");
    public static BedroomsCountType FourPlus { get; } = new("4");

    public override string ToString() => Value;
}
