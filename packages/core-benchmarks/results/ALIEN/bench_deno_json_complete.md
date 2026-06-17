# Deno Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Deno | complete | `warmResolveValue` | 4 / 7 | 14.2 ns | typed-inject | 2.5 ns | tsyringe | 95.7 ns |
| Deno | complete | `warmResolveSingletonClass` | 4 / 7 | 18.1 ns | typed-inject | 4.9 ns | tsyringe | 90.2 ns |
| Deno | complete | `warmResolveTransientClass` | 2 / 6 | 19.4 ns | typed-inject | 18.6 ns | typedi | 143.2 ns |
| Deno | complete | `warmResolveSingletonFactory` | 3 / 7 | 18.0 ns | typed-inject | 3.6 ns | tsyringe | 92.4 ns |
| Deno | complete | `warmResolveTransientFactory` | 3 / 6 | 26.3 ns | typedi | 19.3 ns | tsyringe | 102.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 135.6 ns | scope-di | 135.6 ns | typedi | 739.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 233.6 ns | scope-di | 233.6 ns | typedi | 877.7 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 954.1 ns | scope-di | 954.1 ns | typedi | 4.76 us |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 233.0 ns | typed-inject | 137.5 ns | tsyringe | 739.2 ns |
| Deno | complete | `registrationClass` | 2 / 7 | 191.59 us | tsyringe | 95.33 us | inversify | 1.75 ms |
| Deno | complete | `registrationValue` | 4 / 7 | 129.41 us | tsyringe | 24.47 us | inversify | 1.53 ms |
| Deno | complete | `registrationFactory` | 4 / 7 | 127.37 us | tsyringe | 21.40 us | inversify | 1.66 ms |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Deno | complete | `warmResolveValue` | 2 / 7 | 4 B | typed-inject | 0 B | inversify | 307 B |
| Deno | complete | `warmResolveSingletonClass` | 3 / 7 | 6 B | typed-inject | 1 B | inversify | 304 B |
| Deno | complete | `warmResolveTransientClass` | 1 / 6 | 34 B | scope-di | 34 B | typedi | 459 B |
| Deno | complete | `warmResolveTransientFactory` | 2 / 6 | 64 B | typedi | 62 B | inversify | 363 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 202 B | scope-di | 202 B | typedi | 2.34 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 2.23 KB | scope-di | 2.23 KB | typed-inject | 6.59 KB |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 356 B | typedi | 169 B | inversify | 3.51 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Deno | 2.8.3 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26200 x64 | complete | 300 | [`bench_deno_json_complete.json`](./bench_deno_json_complete.json) |
