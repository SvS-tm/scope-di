# Bun Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Bun | complete | `warmResolveValue` | 4 / 7 | 41.0 ns | typed-inject | 10.0 ns | tsyringe | 99.8 ns |
| Bun | complete | `warmResolveSingletonClass` | 3 / 7 | 36.8 ns | typed-inject | 8.9 ns | tsyringe | 107.5 ns |
| Bun | complete | `warmResolveTransientClass` | 1 / 6 | 36.8 ns | scope-di | 36.8 ns | typedi | 299.7 ns |
| Bun | complete | `warmResolveSingletonFactory` | 5 / 7 | 46.3 ns | typed-inject | 8.9 ns | tsyringe | 98.0 ns |
| Bun | complete | `warmResolveTransientFactory` | 2 / 6 | 48.9 ns | awilix | 46.5 ns | typed-inject | 117.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 275.5 ns | scope-di | 275.5 ns | typedi | 1.60 us |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 375.0 ns | scope-di | 375.0 ns | typedi | 2.14 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.70 us | scope-di | 2.70 us | typedi | 9.35 us |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 402.8 ns | typed-inject | 335.0 ns | tsyringe | 897.4 ns |
| Bun | complete | `registrationClass` | 3 / 7 | 116.16 us | tsyringe | 93.84 us | awilix | 780.18 us |
| Bun | complete | `registrationValue` | 4 / 7 | 70.38 us | typed-inject | 50.05 us | inversify | 472.61 us |
| Bun | complete | `registrationFactory` | 4 / 7 | 78.88 us | typed-inject | 58.28 us | awilix | 722.53 us |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Bun | complete | `warmResolveValue` | 2 / 7 | 2 B | typed-inject | 0 B | typedi | 12 B |
| Bun | complete | `warmResolveSingletonClass` | 2 / 7 | 2 B | typed-inject | 0 B | typedi | 11 B |
| Bun | complete | `warmResolveTransientClass` | 1 / 6 | 1 B | scope-di | 1 B | inversify | 41 B |
| Bun | complete | `warmResolveTransientFactory` | 1 / 6 | 2 B | scope-di | 2 B | typedi | 14 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 39 B | scope-di | 39 B | inversify | 186 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | 3 / 6 | 164 B | typed-inject | 22 B | typedi | 531 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 41 B | inversify | 39 B | typedi | 177 B |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Bun | 1.3.14 | Boni / AMD Ryzen 7 3800X 8-Core Processor / win32 10.0.22631 x64 | complete | 300 | [`bench_bun_json_complete.json`](./bench_bun_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | d71b5796a374cc67fd6a2d166e6eb521cb064fd9 |
| Branch | chore/benchmarks |
