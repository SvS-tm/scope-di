import { expect } from "tstyche";
import { TrackedPromise, TrackedPromiseStatus } from "../index";

const resolved = TrackedPromise.resolved("value");

expect(resolved[TrackedPromise.status]).type.toBe<TrackedPromiseStatus.Success>();
expect(resolved[TrackedPromise.value]).type.toBe<string>();
expect(resolved).type.toBeAssignableTo<Promise<string>>();

const controlled = TrackedPromise.controlled<number>();

expect(controlled).type.toBeAssignableTo<TrackedPromise<number>>();
expect(controlled[TrackedPromise.resolve]).type.toBe<(result: number) => void>();
expect(controlled[TrackedPromise.reject]).type.toBe<(reason: any) => void>();
