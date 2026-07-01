# Deno Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Deno | complete | `warmResolveValue` | 4 / 7 | 14.3 ns | typed-inject | 2.6 ns | tsyringe | 91.1 ns |
| Deno | complete | `warmResolveSingletonClass` | 4 / 7 | 18.6 ns | typed-inject | 3.9 ns | tsyringe | 95.2 ns |
| Deno | complete | `warmResolveTransientClass` | 2 / 6 | 19.5 ns | typed-inject | 19.2 ns | typedi | 145.0 ns |
| Deno | complete | `warmResolveSingletonFactory` | 3 / 7 | 18.7 ns | typed-inject | 3.9 ns | tsyringe | 97.3 ns |
| Deno | complete | `warmResolveTransientFactory` | 3 / 6 | 26.8 ns | typedi | 19.9 ns | tsyringe | 97.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 140.9 ns | scope-di | 140.9 ns | typedi | 738.7 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | 2 / 6 | 242.0 ns | typed-inject | 239.4 ns | typedi | 873.4 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 964.6 ns | scope-di | 964.6 ns | typedi | 4.72 us |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 236.5 ns | typed-inject | 132.3 ns | tsyringe | 734.0 ns |
| Deno | complete | `registrationClass` | 2 / 7 | 195.02 us | tsyringe | 117.60 us | inversify | 1.77 ms |
| Deno | complete | `registrationValue` | 4 / 7 | 129.65 us | tsyringe | 24.52 us | inversify | 1.53 ms |
| Deno | complete | `registrationFactory` | 4 / 7 | 127.27 us | tsyringe | 21.59 us | inversify | 1.65 ms |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Deno | complete | `warmResolveValue` | 2 / 7 | 4 B | typed-inject | 0 B | inversify | 309 B |
| Deno | complete | `warmResolveSingletonClass` | 3 / 7 | 6 B | typed-inject | 0 B | inversify | 307 B |
| Deno | complete | `warmResolveTransientClass` | 1 / 6 | 35 B | scope-di | 35 B | typedi | 468 B |
| Deno | complete | `warmResolveTransientFactory` | 2 / 6 | 65 B | typedi | 61 B | inversify | 363 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 201 B | scope-di | 201 B | typedi | 2.34 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.23 KB | scope-di | 2.23 KB | typed-inject | 6.58 KB |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 357 B | typedi | 151 B | inversify | 3.52 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Deno | 2.9.0 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26200 x64 | complete | 300 | [`bench_deno_json_complete.json`](./bench_deno_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [37df01e132e8953a806c3330fd104433739ebda9](https://github.com/SvS-tm/scope-di/commit/37df01e132e8953a806c3330fd104433739ebda9) |
| Branch | chore/benchmarks |
