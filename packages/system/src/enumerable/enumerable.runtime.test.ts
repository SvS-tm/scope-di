import { describe, expect, it } from "@jest/globals";
import { Enumerable } from "./enumerable";

describe
(
    "Enumerable", 
    () =>
    {
        describe
        (
            "aggregate", 
            () =>
            {
                it
                (
                    "aggregates all items", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3, 4])
                            .aggregate(0, (sum, item) => sum + item);

                        expect(result).toBe(10);
                    }
                );

                it
                (
                    "returns initial value for empty sequence", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable<number>([])
                            .aggregate(123, (sum, item) => sum + item);

                        expect(result).toBe(123);
                    }
                );

                it
                (
                    "passes correct index to aggregator", 
                    () =>
                    {
                        let parts: string[] = [];

                        Enumerable
                            .fromIterable(["a", "b", "c"])
                            .aggregate
                            (
                                undefined,
                                (aggregated, item, index) =>
                                {
                                    parts.push(`${index}:${item}`);

                                    return aggregated;
                                }
                            );

                        expect(parts).toEqual(["0:a", "1:b", "2:c"]);
                    }
                );

                it
                (
                    "does not continue iterating after termination", 
                    () =>
                    {
                        const visited: number[] = [];

                        const result = Enumerable
                            .fromIterable([10, 20, 30, 40])
                            .aggregate
                            (
                                0,
                                (sum, item) =>
                                {
                                    visited.push(item);

                                    const next = sum + item;

                                    return next >= 30
                                        ? Enumerable.terminateAggregation(next)
                                        : next;
                                }
                            );

                        expect(result).toBe(30);
                        expect(visited).toEqual([10, 20]);
                    }
                );
            }
        );

        describe
        (
            "where", 
            () =>
            {
                it
                (
                    "filters using boolean predicate", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3, 4, 5, 6])
                            .where(item => item % 2 === 0)
                            .toArray();

                        expect(result).toEqual([2, 4, 6]);
                    }
                );

                it
                (
                    "preserves order", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([5, 1, 4, 2, 3])
                            .where(item => item > 2)
                            .toArray();

                        expect(result).toEqual([5, 4, 3]);
                    }
                );

                it
                (
                    "returns empty when nothing matches", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3])
                            .where(item => item > 10)
                            .toArray();

                        expect(result).toEqual([]);
                    }
                );

                it
                (
                    "works on empty input", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable<number>([])
                            .where(item => item > 0)
                            .toArray();

                        expect(result).toEqual([]);
                    }
                );

                it
                (
                    "passes correct index to predicate", 
                    () =>
                    {
                        const seen: string[] = [];

                        const result = Enumerable
                            .fromIterable(["a", "b", "c"])
                            .where((item, index) =>
                            {
                                seen.push(`${index}:${item}`);
                                return index % 2 === 0;
                            })
                            .toArray();

                        expect(seen).toEqual(["0:a", "1:b", "2:c"]);
                        expect(result).toEqual(["a", "c"]);
                    }
                );
            }
        );

        describe
        (
            "select", 
            () =>
            {
                it
                (
                    "projects items", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3])
                            .select(item => item * 10)
                            .toArray();

                        expect(result).toEqual([10, 20, 30]);
                    }
                );

                it
                (
                    "passes correct index to selector", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable(["a", "b", "c"])
                            .select((item, index) => `${index}:${item}`)
                            .toArray();

                        expect(result).toEqual(["0:a", "1:b", "2:c"]);
                    }
                );

                it
                (
                    "works on empty input", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable<number>([])
                            .select(item => item * 2)
                            .toArray();

                        expect(result).toEqual([]);
                    }
                );
            }
        );

        describe
        (
            "composition", 
            () =>
            {
                it
                (
                    "supports where + select chaining", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3, 4, 5])
                            .where(item => item % 2 === 1)
                            .select(item => item * 100)
                            .toArray();

                        expect(result).toEqual([100, 300, 500]);
                    }
                );

                it
                (
                    "supports multiple where calls", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3, 4, 5, 6])
                            .where(item => item > 2)
                            .where(item => item < 6)
                            .toArray();

                        expect(result).toEqual([3, 4, 5]);
                    }
                );

                it
                (
                    "supports multiple select calls", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3])
                            .select(item => item + 1)
                            .select(item => item * 2)
                            .toArray();

                        expect(result).toEqual([4, 6, 8]);
                    }
                );

                it
                (
                    "is lazy", 
                    () =>
                    {
                        const calls: string[] = [];

                        const query = Enumerable
                            .fromIterable([1, 2, 3])
                            .where
                            (
                                (item) =>
                                {
                                    calls.push(`where:${item}`);
                                    return item >= 2;
                                }
                            )
                            .select
                            (
                                (item) =>
                                {
                                    calls.push(`select:${item}`);
                                    return item * 10;
                                }
                            );

                        expect(calls).toEqual([]);

                        const result = query.toArray();

                        expect(result).toEqual([20, 30]);
                        expect(calls).toEqual
                        (
                            [
                                "where:1",
                                "where:2",
                                "select:2",
                                "where:3",
                                "select:3"
                            ]
                        );
                    }
                );
            }
        );

        describe
        (
            "toArray", 
            () =>
            {
                it
                (
                    "materializes current sequence", 
                    () =>
                    {
                        const result = Enumerable
                            .fromIterable([1, 2, 3])
                            .toArray();

                        expect(result).toEqual([1, 2, 3]);
                    }
                );

                it
                (
                    "can be called repeatedly for fromFactory", 
                    () =>
                    {
                        function *numbers()
                        {
                            yield 1;
                            yield 2;
                            yield 3;
                        }

                        const enumerable = Enumerable.fromFactory(numbers);

                        expect(enumerable.toArray()).toEqual([1, 2, 3]);
                        expect(enumerable.toArray()).toEqual([1, 2, 3]);
                    }
                );

                it
                (
                    "reflects one-shot behavior for fromIterable(generator())", 
                    () =>
                    {
                        function *numbers()
                        {
                            yield 1;
                            yield 2;
                            yield 3;
                        }

                        const enumerable = Enumerable.fromIterable(numbers());

                        expect(enumerable.toArray()).toEqual([1, 2, 3]);
                        expect(enumerable.toArray()).toEqual([]);
                    }
                );
            }
        );

        describe
        (
            "iteration", 
            () =>
            {
                it
                (
                    "supports spread syntax", 
                    () =>
                    {
                        const enumerable = Enumerable
                            .fromIterable([1, 2, 3])
                            .select(item => item * 2);

                        expect([...enumerable]).toEqual([2, 4, 6]);
                    }
                );

                it
                (
                    "supports for...of", 
                    () =>
                    {
                        const enumerable = Enumerable
                            .fromIterable([1, 2, 3]);

                        const result: number[] = [];

                        for (const item of enumerable)
                            result.push(item);

                        expect(result).toEqual([1, 2, 3]);
                    }
                );
            }
        );
    }
);
