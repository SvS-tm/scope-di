# Bun Benchmark Report

## Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Bun | complete | `warmResolveValue` | 4 / 7 | 19.9 ns | typed-inject | 4.9 ns | tsyringe | 45.7 ns |
| Bun | complete | `warmResolveSingletonClass` | 4 / 7 | 20.5 ns | typed-inject | 4.3 ns | tsyringe | 51.2 ns |
| Bun | complete | `warmResolveTransientClass` | 1 / 6 | 20.1 ns | scope-di | 20.1 ns | typedi | 154.4 ns |
| Bun | complete | `warmResolveSingletonFactory` | 3 / 7 | 17.8 ns | typed-inject | 4.7 ns | tsyringe | 52.7 ns |
| Bun | complete | `warmResolveTransientFactory` | 2 / 6 | 25.5 ns | awilix | 25.4 ns | tsyringe | 53.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 115.2 ns | scope-di | 115.2 ns | typedi | 790.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | 1 / 6 | 169.0 ns | scope-di | 169.0 ns | typedi | 960.5 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | 1 / 6 | 1.44 us | scope-di | 1.44 us | typedi | 4.78 us |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | 3 / 6 | 205.7 ns | typed-inject | 192.3 ns | tsyringe | 480.5 ns |
| Bun | complete | `registrationClass` | 3 / 7 | 52.83 us | tsyringe | 46.43 us | awilix | 406.71 us |
| Bun | complete | `registrationValue` | 4 / 7 | 37.86 us | needle-di | 18.16 us | inversify | 252.56 us |
| Bun | complete | `registrationFactory` | 4 / 7 | 42.04 us | tsyringe | 17.71 us | awilix | 369.85 us |

## Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Bun | complete | `warmResolveValue` | 2 / 7 | 1 B | typed-inject | 0 B | inversify | 11 B |
| Bun | complete | `warmResolveSingletonClass` | 2 / 7 | 1 B | typed-inject | 0 B | typedi | 16 B |
| Bun | complete | `warmResolveTransientClass` | 1 / 6 | 1 B | scope-di | 1 B | typedi | 37 B |
| Bun | complete | `warmResolveTransientFactory` | 1 / 6 | 1 B | scope-di | 1 B | typedi | 15 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | 1 / 6 | 28 B | scope-di | 28 B | inversify | 142 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | 3 / 6 | 118 B | awilix | 22 B | typedi | 190 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | 1 / 6 | 20 B | scope-di | 20 B | typedi | 99 B |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Bun | 1.3.14 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26200 x64 | complete | 300 | [`bench_bun_json_complete.json`](./bench_bun_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [f1ad04e0d5b701982b02a770292b4e0a7947fc85](https://github.com/SvS-tm/scope-di/commit/f1ad04e0d5b701982b02a770292b4e0a7947fc85) |
| Branch | develop |
