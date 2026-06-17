# Node.js Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | 4 / 7 | 20.1 ns | typed-inject | 3.2 ns | tsyringe | 98.2 ns |
| Node.js | complete | `warmResolveSingletonClass` | 3 / 7 | 20.8 ns | typed-inject | 4.8 ns | tsyringe | 102.3 ns |
| Node.js | complete | `warmResolveTransientClass` | 2 / 6 | 23.8 ns | typed-inject | 22.2 ns | typedi | 144.4 ns |
| Node.js | complete | `warmResolveSingletonFactory` | 3 / 7 | 20.6 ns | typed-inject | 5.1 ns | tsyringe | 101.1 ns |
| Node.js | complete | `warmResolveTransientFactory` | 3 / 6 | 32.6 ns | typed-inject | 21.9 ns | tsyringe | 104.0 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 150.3 ns | scope-di | 150.3 ns | typedi | 731.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 251.0 ns | scope-di | 251.0 ns | typedi | 881.2 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 1.02 us | scope-di | 1.02 us | typedi | 4.68 us |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 241.3 ns | typed-inject | 140.6 ns | tsyringe | 716.4 ns |
| Node.js | complete | `registrationClass` | 3 / 7 | 274.38 us | typed-inject | 206.80 us | inversify | 1.80 ms |
| Node.js | complete | `registrationValue` | 4 / 7 | 139.50 us | tsyringe | 28.68 us | inversify | 1.70 ms |
| Node.js | complete | `registrationFactory` | 3 / 7 | 135.69 us | tsyringe | 113.94 us | inversify | 1.81 ms |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | 3 / 7 | 5 B | typed-inject | 0 B | inversify | 306 B |
| Node.js | complete | `warmResolveSingletonClass` | 3 / 7 | 5 B | typed-inject | 0 B | inversify | 309 B |
| Node.js | complete | `warmResolveTransientClass` | 1 / 6 | 31 B | scope-di | 31 B | typedi | 491 B |
| Node.js | complete | `warmResolveTransientFactory` | 2 / 6 | 64 B | typedi | 60 B | inversify | 367 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 231 B | scope-di | 231 B | typedi | 2.34 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.23 KB | scope-di | 2.23 KB | typed-inject | 6.58 KB |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | 2 / 6 | 322 B | typedi | 139 B | inversify | 3.49 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Node.js | v26.3.0 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26200 x64 | complete | 300 | [`bench_node_json_complete.json`](./bench_node_json_complete.json) |
