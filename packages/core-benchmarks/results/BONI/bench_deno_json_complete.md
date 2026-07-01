# Deno Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Deno | complete | `warmResolveValue` | 5 / 7 | 28.0 ns | typed-inject | 9.9 ns | tsyringe | 169.8 ns |
| Deno | complete | `warmResolveSingletonClass` | 5 / 7 | 38.6 ns | typed-inject | 6.4 ns | tsyringe | 173.0 ns |
| Deno | complete | `warmResolveTransientClass` | 2 / 6 | 38.1 ns | typed-inject | 30.7 ns | typedi | 295.0 ns |
| Deno | complete | `warmResolveSingletonFactory` | 5 / 7 | 40.1 ns | typed-inject | 6.7 ns | tsyringe | 177.6 ns |
| Deno | complete | `warmResolveTransientFactory` | 3 / 6 | 47.5 ns | typedi | 34.9 ns | tsyringe | 193.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 238.9 ns | scope-di | 238.9 ns | typedi | 1.43 us |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | 2 / 6 | 547.1 ns | typed-inject | 372.9 ns | typedi | 1.76 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 1.75 us | scope-di | 1.75 us | typedi | 9.17 us |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 461.5 ns | typed-inject | 271.1 ns | tsyringe | 1.32 us |
| Deno | complete | `registrationClass` | 4 / 7 | 504.79 us | tsyringe | 170.89 us | inversify | 3.05 ms |
| Deno | complete | `registrationValue` | 4 / 7 | 239.63 us | tsyringe | 42.74 us | inversify | 2.69 ms |
| Deno | complete | `registrationFactory` | 4 / 7 | 223.82 us | tsyringe | 42.46 us | inversify | 2.94 ms |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Deno | complete | `warmResolveValue` | 3 / 7 | 13 B | typed-inject | 2 B | inversify | 312 B |
| Deno | complete | `warmResolveSingletonClass` | 4 / 7 | 12 B | typed-inject | 0 B | inversify | 313 B |
| Deno | complete | `warmResolveTransientClass` | 1 / 6 | 36 B | scope-di | 36 B | typedi | 516 B |
| Deno | complete | `warmResolveTransientFactory` | 2 / 6 | 68 B | typedi | 65 B | inversify | 372 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 232 B | scope-di | 232 B | typedi | 2.34 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.23 KB | scope-di | 2.23 KB | typed-inject | 6.59 KB |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | 2 / 6 | 348 B | typedi | 163 B | inversify | 3.45 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Deno | 2.9.0 | Boni / AMD Ryzen 7 3800X 8-Core Processor / win32 10.0.22631 x64 | complete | 300 | [`bench_deno_json_complete.json`](./bench_deno_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | d71b5796a374cc67fd6a2d166e6eb521cb064fd9 |
| Branch | chore/benchmarks |
