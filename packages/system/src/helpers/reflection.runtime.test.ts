import { describe, expect, it } from "@jest/globals";
import { Reflection } from "./reflection";

type ReflectionTarget =
{
    first: string;
    second: number;
    nested: { child: { value: boolean } };
    items: { value: number }[];
    "special-key": string;
};

describe
(
    "Reflection.runtimeNameOf",
    () =>
    {
        it
        (
            "returns the name of a directly accessed property",
            () =>
            {
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => target.first)).toBe("first");
            }
        );

        it
        (
            "returns the final property name for nested accesses",
            () =>
            {
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => target.nested.child)).toBe("child");
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => target.nested.child.value)).toBe("value");
            }
        );

        it
        (
            "supports computed properties and array indices",
            () =>
            {
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => target["special-key"])).toBe("special-key");
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => target.items[0])).toBe("0");
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => target.items[0].value)).toBe("value");
            }
        );

        it
        (
            "returns the last accessed name when the selector accesses separate properties",
            () =>
            {
                expect(Reflection.runtimeNameOf<ReflectionTarget>(target => [target.first, target.second])).toBe("second");
            }
        );

        it
        (
            "throws when the selector does not access a property",
            () =>
            {
                expect(() => Reflection.runtimeNameOf<ReflectionTarget>(target => target))
                    .toThrow("Selector must access at least one member of the target!");
            }
        );
    }
);

describe
(
    "Reflection.runtimeAccessesOf",
    () =>
    {
        it
        (
            "records nested property accesses in order",
            () =>
            {
                expect(Reflection.runtimeAccessesOf<ReflectionTarget>(target => target.nested.child.value))
                    .toEqual(["nested", "child", "value"]);
            }
        );

        it
        (
            "records separate and repeated accesses in execution order",
            () =>
            {
                expect
                (
                    Reflection.runtimeAccessesOf<ReflectionTarget>
                    (
                        target => [target.first, target.nested.child.value, target.first, target.second]
                    )
                )
                    .toEqual(["first", "nested", "child", "value", "first", "second"]);
            }
        );

        it
        (
            "records computed property names and array indices",
            () =>
            {
                expect(Reflection.runtimeAccessesOf<ReflectionTarget>(target => [target["special-key"], target.items[0].value]))
                    .toEqual(["special-key", "items", "0", "value"]);
            }
        );

        it
        (
            "returns an empty array when the selector does not access a property",
            () =>
            {
                expect(Reflection.runtimeAccessesOf<ReflectionTarget>(target => target)).toEqual([]);
            }
        );

        it
        (
            "keeps recorded accesses independent between invocations",
            () =>
            {
                const first = Reflection.runtimeAccessesOf<ReflectionTarget>(target => target.first);
                const second = Reflection.runtimeAccessesOf<ReflectionTarget>(target => target.second);

                first.push("changed");

                expect(second).toEqual(["second"]);
                expect(Reflection.runtimeAccessesOf<ReflectionTarget>(target => target.first)).toEqual(["first"]);
            }
        );
    }
);

describe
(
    "Reflection selectors",
    () =>
    {
        it
        (
            "propagates errors thrown by selectors",
            () =>
            {
                const error = new Error("Selector failed");
                const selector: Reflection.RuntimeSelector<ReflectionTarget> = target =>
                {
                    target.first;

                    throw error;
                };

                expect(() => Reflection.runtimeNameOf(selector)).toThrow(error);
                expect(() => Reflection.runtimeAccessesOf(selector)).toThrow(error);
            }
        );
    }
);
