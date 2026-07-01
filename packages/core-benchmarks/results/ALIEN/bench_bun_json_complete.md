# Bun Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Bun | complete | `warmResolveValue` | 2 / 7 | 20.7 ns | typed-inject | 5.2 ns | tsyringe | 46.6 ns |
| Bun | complete | `warmResolveSingletonClass` | 3 / 7 | 20.1 ns | typed-inject | 4.8 ns | tsyringe | 51.4 ns |
| Bun | complete | `warmResolveTransientClass` | 1 / 6 | 20.3 ns | scope-di | 20.3 ns | typedi | 149.5 ns |
| Bun | complete | `warmResolveSingletonFactory` | 3 / 7 | 18.7 ns | typed-inject | 4.9 ns | tsyringe | 51.1 ns |
| Bun | complete | `warmResolveTransientFactory` | 1 / 6 | 24.5 ns | scope-di | 24.5 ns | tsyringe | 53.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 113.7 ns | scope-di | 113.7 ns | typedi | 847.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 178.9 ns | scope-di | 178.9 ns | typedi | 967.2 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 1.44 us | scope-di | 1.44 us | typedi | 4.85 us |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | 2 / 6 | 210.9 ns | typed-inject | 185.1 ns | tsyringe | 480.6 ns |
| Bun | complete | `registrationClass` | 3 / 7 | 51.77 us | tsyringe | 45.67 us | awilix | 403.95 us |
| Bun | complete | `registrationValue` | 4 / 7 | 37.33 us | tsyringe | 17.50 us | inversify | 246.95 us |
| Bun | complete | `registrationFactory` | 2 / 7 | 28.37 us | tsyringe | 18.51 us | awilix | 384.35 us |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Bun | complete | `warmResolveValue` | 2 / 7 | 1 B | typed-inject | 0 B | inversify | 14 B |
| Bun | complete | `warmResolveSingletonClass` | 2 / 7 | 0 B | typed-inject | 0 B | typedi | 7 B |
| Bun | complete | `warmResolveTransientClass` | 1 / 6 | 1 B | scope-di | 1 B | typedi | 33 B |
| Bun | complete | `warmResolveTransientFactory` | 1 / 6 | 1 B | scope-di | 1 B | inversify | 9 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 19 B | scope-di | 19 B | typedi | 258 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | 4 / 6 | 117 B | awilix | 25 B | typedi | 361 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | 2 / 6 | 34 B | typed-inject | 32 B | awilix | 97 B |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Bun | 1.3.14 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26200 x64 | complete | 300 | [`bench_bun_json_complete.json`](./bench_bun_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [37df01e132e8953a806c3330fd104433739ebda9](https://github.com/SvS-tm/scope-di/commit/37df01e132e8953a806c3330fd104433739ebda9) |
| Branch | chore/benchmarks |
