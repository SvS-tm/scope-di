# Node.js Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | 4 / 7 | 16.8 ns | typed-inject | 6.4 ns | tsyringe | 94.8 ns |
| Node.js | complete | `warmResolveSingletonClass` | 3 / 7 | 18.3 ns | typed-inject | 5.2 ns | tsyringe | 92.8 ns |
| Node.js | complete | `warmResolveTransientClass` | 1 / 6 | 23.5 ns | scope-di | 23.5 ns | typedi | 151.2 ns |
| Node.js | complete | `warmResolveSingletonFactory` | 3 / 7 | 20.8 ns | typed-inject | 4.9 ns | tsyringe | 102.7 ns |
| Node.js | complete | `warmResolveTransientFactory` | 2 / 6 | 25.3 ns | typedi | 21.7 ns | tsyringe | 104.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 147.6 ns | scope-di | 147.6 ns | typedi | 776.0 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 237.1 ns | scope-di | 237.1 ns | typedi | 911.7 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 1.00 us | scope-di | 1.00 us | typedi | 4.84 us |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 221.8 ns | typed-inject | 153.1 ns | tsyringe | 755.9 ns |
| Node.js | complete | `registrationClass` | 1 / 7 | 203.23 us | scope-di | 203.23 us | inversify | 1.88 ms |
| Node.js | complete | `registrationValue` | 4 / 7 | 140.99 us | tsyringe | 29.74 us | inversify | 1.61 ms |
| Node.js | complete | `registrationFactory` | 3 / 7 | 145.59 us | typed-inject | 123.57 us | inversify | 1.69 ms |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | 2 / 7 | 6 B | typed-inject | 1 B | inversify | 257 B |
| Node.js | complete | `warmResolveSingletonClass` | 3 / 7 | 5 B | typed-inject | 1 B | inversify | 309 B |
| Node.js | complete | `warmResolveTransientClass` | 1 / 6 | 32 B | scope-di | 32 B | typedi | 477 B |
| Node.js | complete | `warmResolveTransientFactory` | 1 / 6 | 64 B | scope-di | 64 B | inversify | 369 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 217 B | scope-di | 217 B | typedi | 2.34 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.23 KB | scope-di | 2.23 KB | typedi | 11.77 KB |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | 2 / 6 | 319 B | typedi | 141 B | inversify | 3.49 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Node.js | v24.18.0 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26200 x64 | complete | 300 | [`bench_node_json_complete.json`](./bench_node_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [37df01e132e8953a806c3330fd104433739ebda9](https://github.com/SvS-tm/scope-di/commit/37df01e132e8953a806c3330fd104433739ebda9) |
| Branch | chore/benchmarks |
