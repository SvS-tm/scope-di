import { expect } from "tstyche";
import { ChancyValue } from "../index";

const value = ChancyValue.success<string | null>("value");

if (ChancyValue.isSuccess(value))
{
    expect(ChancyValue.get(value)).type.toBe<string | null>();
}

const failed = ChancyValue.failure<string>();

expect(ChancyValue.isSuccess(failed)).type.toBe<boolean>();
