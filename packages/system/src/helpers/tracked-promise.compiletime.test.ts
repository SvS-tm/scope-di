import { expectAssignable, expectType } from "tsd-lite";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";

const resolved = TrackedPromise.resolved("value");

expectType<TrackedPromiseStatus.Success>(resolved[TrackedPromise.status]);
expectType<string>(resolved[TrackedPromise.value]);
expectAssignable<Promise<string>>(resolved);

const controlled = TrackedPromise.controlled<number>();

expectAssignable<TrackedPromise<number>>(controlled);
expectType<(result: number) => void>(controlled[TrackedPromise.resolve]);
expectType<(reason: any) => void>(controlled[TrackedPromise.reject]);
