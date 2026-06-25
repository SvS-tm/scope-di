import { expectType } from "tsd";
import { ChancyValue } from "../index";

const value = ChancyValue.success<string | null>("value");

if (ChancyValue.isSuccess(value))
{
    expectType<string | null>(ChancyValue.get(value));
}

const failed = ChancyValue.failure<string>();

expectType<boolean>(ChancyValue.isSuccess(failed));
