# Node.js Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | 4 / 7 | 29.0 ns | typed-inject | 6.8 ns | tsyringe | 173.4 ns |
| Node.js | complete | `warmResolveSingletonClass` | 5 / 7 | 36.4 ns | typed-inject | 7.6 ns | tsyringe | 193.2 ns |
| Node.js | complete | `warmResolveTransientClass` | 2 / 6 | 47.0 ns | typed-inject | 41.0 ns | typedi | 292.2 ns |
| Node.js | complete | `warmResolveSingletonFactory` | 4 / 7 | 36.3 ns | typed-inject | 7.5 ns | tsyringe | 190.3 ns |
| Node.js | complete | `warmResolveTransientFactory` | 3 / 6 | 42.9 ns | typedi | 39.2 ns | tsyringe | 195.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 275.5 ns | scope-di | 275.5 ns | typedi | 1.46 us |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 518.1 ns | scope-di | 518.1 ns | typedi | 1.74 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 1.86 us | scope-di | 1.86 us | typedi | 8.77 us |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 431.6 ns | typed-inject | 301.4 ns | tsyringe | 1.30 us |
| Node.js | complete | `registrationClass` | 3 / 7 | 377.01 us | typed-inject | 361.21 us | inversify | 3.26 ms |
| Node.js | complete | `registrationValue` | 4 / 7 | 212.92 us | tsyringe | 41.69 us | inversify | 2.69 ms |
| Node.js | complete | `registrationFactory` | 3 / 7 | 224.71 us | tsyringe | 192.40 us | inversify | 2.74 ms |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | 2 / 7 | 8 B | typed-inject | 2 B | inversify | 263 B |
| Node.js | complete | `warmResolveSingletonClass` | 3 / 7 | 9 B | typed-inject | 1 B | inversify | 308 B |
| Node.js | complete | `warmResolveTransientClass` | 1 / 6 | 37 B | scope-di | 37 B | typedi | 490 B |
| Node.js | complete | `warmResolveTransientFactory` | 1 / 6 | 68 B | scope-di | 68 B | inversify | 370 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 231 B | scope-di | 231 B | typedi | 2.34 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.23 KB | scope-di | 2.23 KB | typedi | 11.78 KB |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | 2 / 6 | 316 B | typedi | 135 B | inversify | 3.45 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Node.js | v24.18.0 | Boni / AMD Ryzen 7 3800X 8-Core Processor / win32 10.0.22631 x64 | complete | 300 | [`bench_node_json_complete.json`](./bench_node_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | d71b5796a374cc67fd6a2d166e6eb521cb064fd9 |
| Branch | chore/benchmarks |
