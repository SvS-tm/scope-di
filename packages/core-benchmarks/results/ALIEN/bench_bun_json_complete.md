# Bun Benchmark Report

[Scope DI startup report](./bench_bun_json_complete.startup.md)

Each case is measured in fresh processes. Time is the median of process medians; the range shows the minimum and maximum process medians. Allocations are the median of process allocation averages. Raw JSON retains every process measurement.

Library results were collected independently. Rankings compare the case measurements below.

- [scope-di raw results](bench_bun_json_complete/scope-di.json)
- [inversify raw results](bench_bun_json_complete/inversify.json)
- [tsyringe raw results](bench_bun_json_complete/tsyringe.json)
- [awilix raw results](bench_bun_json_complete/awilix.json)
- [typedi raw results](bench_bun_json_complete/typedi.json)
- [typed-inject raw results](bench_bun_json_complete/typed-inject.json)
- [needle-di raw results](bench_bun_json_complete/needle-di.json)

## Speed Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Time | Process median range |
| --- | --- | --- | --- | ---: | ---: | --- |
| Bun | complete | `registrationClass` | typed-inject | 1 / 9 | 32.90 us | 32.70 us - 33.50 us |
| Bun | complete | `registrationClass` | tsyringe | 2 / 9 | 38.00 us | 37.60 us - 38.60 us |
| Bun | complete | `registrationClass` | needle-di | 3 / 9 | 52.30 us | 50.40 us - 53.00 us |
| Bun | complete | `registrationClass` | scope-di-codegen | 4 / 9 | 66.10 us | 65.60 us - 69.40 us |
| Bun | complete | `registrationClass` | scope-di | 5 / 9 | 66.30 us | 65.00 us - 69.50 us |
| Bun | complete | `registrationClass` | typedi | 6 / 9 | 156.70 us | 154.60 us - 157.70 us |
| Bun | complete | `registrationClass` | inversify-jit | 7 / 9 | 222.10 us | 219.00 us - 225.00 us |
| Bun | complete | `registrationClass` | inversify | 8 / 9 | 223.40 us | 219.40 us - 234.80 us |
| Bun | complete | `registrationClass` | awilix | 9 / 9 | 334.40 us | 326.90 us - 341.10 us |
| Bun | complete | `registrationValue` | typed-inject | 1 / 9 | 17.80 us | 17.00 us - 18.70 us |
| Bun | complete | `registrationValue` | needle-di | 2 / 9 | 21.50 us | 20.90 us - 22.30 us |
| Bun | complete | `registrationValue` | tsyringe | 3 / 9 | 22.80 us | 22.40 us - 22.90 us |
| Bun | complete | `registrationValue` | scope-di | 4 / 9 | 53.90 us | 52.80 us - 56.10 us |
| Bun | complete | `registrationValue` | scope-di-codegen | 5 / 9 | 54.00 us | 53.00 us - 55.50 us |
| Bun | complete | `registrationValue` | awilix | 6 / 9 | 138.70 us | 137.20 us - 140.30 us |
| Bun | complete | `registrationValue` | inversify-jit | 7 / 9 | 147.50 us | 144.90 us - 149.20 us |
| Bun | complete | `registrationValue` | inversify | 8 / 9 | 149.20 us | 147.50 us - 151.50 us |
| Bun | complete | `registrationValue` | typedi | 9 / 9 | 151.30 us | 149.10 us - 152.50 us |
| Bun | complete | `registrationFactory` | typed-inject | 1 / 9 | 18.40 us | 18.30 us - 20.00 us |
| Bun | complete | `registrationFactory` | needle-di | 2 / 9 | 21.60 us | 21.50 us - 23.00 us |
| Bun | complete | `registrationFactory` | tsyringe | 3 / 9 | 28.70 us | 28.10 us - 29.50 us |
| Bun | complete | `registrationFactory` | scope-di-codegen | 4 / 9 | 53.50 us | 53.10 us - 55.30 us |
| Bun | complete | `registrationFactory` | scope-di | 5 / 9 | 54.00 us | 53.20 us - 56.60 us |
| Bun | complete | `registrationFactory` | typedi | 6 / 9 | 137.90 us | 137.60 us - 140.10 us |
| Bun | complete | `registrationFactory` | inversify-jit | 7 / 9 | 162.50 us | 159.40 us - 168.10 us |
| Bun | complete | `registrationFactory` | inversify | 8 / 9 | 162.70 us | 159.00 us - 165.70 us |
| Bun | complete | `registrationFactory` | awilix | 9 / 9 | 260.70 us | 258.30 us - 265.20 us |
| Bun | complete | `warmResolveValue` | typed-inject | 1 / 11 | 4.8 ns | 4.6 ns - 4.9 ns |
| Bun | complete | `warmResolveValue` | awilix | 2 / 11 | 7.3 ns | 7.1 ns - 7.4 ns |
| Bun | complete | `warmResolveValue` | inversify | 3 / 11 | 13.5 ns | 13.5 ns - 13.7 ns |
| Bun | complete | `warmResolveValue` | inversify-jit | 4 / 11 | 13.6 ns | 13.3 ns - 13.7 ns |
| Bun | complete | `warmResolveValue` | needle-di | 5 / 11 | 14.3 ns | 13.9 ns - 14.7 ns |
| Bun | complete | `warmResolveValue` | typedi | 6 / 11 | 15.0 ns | 14.6 ns - 15.0 ns |
| Bun | complete | `warmResolveValue` | scope-di-module-reload | 7 / 11 | 16.0 ns | 15.6 ns - 16.7 ns |
| Bun | complete | `warmResolveValue` | scope-di-module-reload-codegen | 8 / 11 | 16.1 ns | 15.7 ns - 16.9 ns |
| Bun | complete | `warmResolveValue` | scope-di-codegen | 9 / 11 | 16.3 ns | 15.8 ns - 16.7 ns |
| Bun | complete | `warmResolveValue` | scope-di | 10 / 11 | 16.5 ns | 15.6 ns - 16.7 ns |
| Bun | complete | `warmResolveValue` | tsyringe | 11 / 11 | 41.2 ns | 29.6 ns - 42.2 ns |
| Bun | complete | `coldResolveValue` | typed-inject | 1 / 9 | 10.0 ns | 9.7 ns - 10.1 ns |
| Bun | complete | `coldResolveValue` | typedi | 2 / 9 | 44.4 ns | 43.8 ns - 45.7 ns |
| Bun | complete | `coldResolveValue` | awilix | 3 / 9 | 70.4 ns | 53.9 ns - 77.7 ns |
| Bun | complete | `coldResolveValue` | scope-di | 4 / 9 | 88.3 ns | 68.3 ns - 109.9 ns |
| Bun | complete | `coldResolveValue` | scope-di-codegen | 5 / 9 | 100.2 ns | 71.4 ns - 112.2 ns |
| Bun | complete | `coldResolveValue` | needle-di | 6 / 9 | 105.7 ns | 104.9 ns - 106.5 ns |
| Bun | complete | `coldResolveValue` | tsyringe | 7 / 9 | 106.4 ns | 101.2 ns - 107.3 ns |
| Bun | complete | `coldResolveValue` | inversify-jit | 8 / 9 | 20.60 us | 20.30 us - 20.60 us |
| Bun | complete | `coldResolveValue` | inversify | 9 / 9 | 20.70 us | 20.40 us - 21.70 us |
| Bun | complete | `warmResolveSingletonClass` | awilix | 1 / 11 | 0.9 ns | 0.9 ns - 0.9 ns |
| Bun | complete | `warmResolveSingletonClass` | typed-inject | 2 / 11 | 2.1 ns | 2.1 ns - 2.2 ns |
| Bun | complete | `warmResolveSingletonClass` | inversify-jit | 3 / 11 | 11.0 ns | 11.0 ns - 11.3 ns |
| Bun | complete | `warmResolveSingletonClass` | inversify | 4 / 11 | 11.3 ns | 11.0 ns - 11.4 ns |
| Bun | complete | `warmResolveSingletonClass` | needle-di | 5 / 11 | 13.9 ns | 13.8 ns - 14.0 ns |
| Bun | complete | `warmResolveSingletonClass` | typedi | 6 / 11 | 15.6 ns | 15.5 ns - 16.4 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di-codegen | 7 / 11 | 15.8 ns | 15.4 ns - 16.4 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di | 8 / 11 | 16.0 ns | 15.5 ns - 16.6 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 9 / 11 | 16.0 ns | 15.8 ns - 16.4 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload | 10 / 11 | 16.1 ns | 15.7 ns - 16.2 ns |
| Bun | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 47.4 ns | 46.6 ns - 48.3 ns |
| Bun | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 46.3 ns | 45.7 ns - 46.8 ns |
| Bun | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 92.5 ns | 80.1 ns - 113.0 ns |
| Bun | complete | `coldResolveSingletonClass` | typedi | 3 / 9 | 97.0 ns | 92.8 ns - 98.4 ns |
| Bun | complete | `coldResolveSingletonClass` | scope-di | 4 / 9 | 98.7 ns | 87.0 ns - 118.8 ns |
| Bun | complete | `coldResolveSingletonClass` | needle-di | 5 / 9 | 130.8 ns | 122.6 ns - 132.6 ns |
| Bun | complete | `coldResolveSingletonClass` | tsyringe | 6 / 9 | 139.4 ns | 120.2 ns - 149.0 ns |
| Bun | complete | `coldResolveSingletonClass` | awilix | 7 / 9 | 142.2 ns | 134.2 ns - 142.9 ns |
| Bun | complete | `coldResolveSingletonClass` | inversify | 8 / 9 | 25.80 us | 25.60 us - 26.00 us |
| Bun | complete | `coldResolveSingletonClass` | inversify-jit | 9 / 9 | 25.80 us | 25.40 us - 26.50 us |
| Bun | complete | `warmResolveTransientClass` | inversify-jit | 1 / 10 | 12.6 ns | 12.6 ns - 12.8 ns |
| Bun | complete | `warmResolveTransientClass` | inversify | 2 / 10 | 13.0 ns | 12.9 ns - 13.2 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload | 3 / 10 | 14.1 ns | 13.9 ns - 14.5 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 4 / 10 | 14.3 ns | 13.9 ns - 14.5 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di-codegen | 5 / 10 | 14.4 ns | 14.3 ns - 14.4 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di | 6 / 10 | 14.5 ns | 14.4 ns - 14.7 ns |
| Bun | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 28.4 ns | 28.2 ns - 28.5 ns |
| Bun | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 42.0 ns | 41.4 ns - 42.7 ns |
| Bun | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 59.1 ns | 58.5 ns - 60.6 ns |
| Bun | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 85.2 ns | 83.1 ns - 86.6 ns |
| Bun | complete | `coldResolveTransientClass` | typed-inject | 1 / 8 | 31.1 ns | 30.9 ns - 31.3 ns |
| Bun | complete | `coldResolveTransientClass` | scope-di | 2 / 8 | 88.5 ns | 69.0 ns - 100.2 ns |
| Bun | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 89.5 ns | 87.3 ns - 90.4 ns |
| Bun | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 107.2 ns | 102.8 ns - 126.2 ns |
| Bun | complete | `coldResolveTransientClass` | awilix | 5 / 8 | 113.5 ns | 106.3 ns - 115.0 ns |
| Bun | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 6.02 us | 5.96 us - 6.31 us |
| Bun | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 25.30 us | 24.80 us - 25.80 us |
| Bun | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 58.80 us | 58.30 us - 65.40 us |
| Bun | complete | `warmResolveSingletonFactory` | awilix | 1 / 11 | 0.9 ns | 0.9 ns - 0.9 ns |
| Bun | complete | `warmResolveSingletonFactory` | typed-inject | 2 / 11 | 2.1 ns | 2.1 ns - 2.2 ns |
| Bun | complete | `warmResolveSingletonFactory` | inversify-jit | 3 / 11 | 11.1 ns | 11.1 ns - 11.2 ns |
| Bun | complete | `warmResolveSingletonFactory` | inversify | 4 / 11 | 11.3 ns | 11.0 ns - 11.5 ns |
| Bun | complete | `warmResolveSingletonFactory` | needle-di | 5 / 11 | 14.1 ns | 14.0 ns - 14.2 ns |
| Bun | complete | `warmResolveSingletonFactory` | typedi | 6 / 11 | 15.5 ns | 15.3 ns - 15.8 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 7 / 11 | 15.6 ns | 15.4 ns - 16.3 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-codegen | 8 / 11 | 15.7 ns | 15.5 ns - 16.6 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 9 / 11 | 16.1 ns | 15.7 ns - 16.4 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di | 10 / 11 | 16.3 ns | 15.6 ns - 16.6 ns |
| Bun | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 52.0 ns | 30.9 ns - 55.4 ns |
| Bun | complete | `coldResolveSingletonFactory` | typed-inject | 1 / 9 | 48.8 ns | 48.4 ns - 49.2 ns |
| Bun | complete | `coldResolveSingletonFactory` | typedi | 2 / 9 | 55.7 ns | 54.2 ns - 56.0 ns |
| Bun | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 78.2 ns | 67.5 ns - 85.1 ns |
| Bun | complete | `coldResolveSingletonFactory` | scope-di | 4 / 9 | 83.1 ns | 78.1 ns - 85.4 ns |
| Bun | complete | `coldResolveSingletonFactory` | awilix | 5 / 9 | 110.4 ns | 109.5 ns - 114.6 ns |
| Bun | complete | `coldResolveSingletonFactory` | tsyringe | 6 / 9 | 118.7 ns | 116.0 ns - 133.0 ns |
| Bun | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 125.2 ns | 121.3 ns - 126.8 ns |
| Bun | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 23.30 us | 23.00 us - 23.70 us |
| Bun | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 23.30 us | 22.90 us - 23.50 us |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 1 / 10 | 11.3 ns | 11.0 ns - 11.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 2 / 10 | 14.2 ns | 14.2 ns - 14.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 3 / 10 | 14.6 ns | 14.5 ns - 17.0 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 4 / 10 | 14.9 ns | 14.9 ns - 16.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 5 / 10 | 15.4 ns | 15.1 ns - 15.6 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 6 / 10 | 15.5 ns | 14.9 ns - 16.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 7 / 10 | 15.6 ns | 15.6 ns - 15.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 8 / 10 | 19.0 ns | 18.8 ns - 19.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 9 / 10 | 31.0 ns | 29.4 ns - 31.1 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 53.6 ns | 53.1 ns - 55.1 ns |
| Bun | complete | `warmResolveTransientFactory` | awilix | 1 / 10 | 11.8 ns | 11.6 ns - 12.0 ns |
| Bun | complete | `warmResolveTransientFactory` | inversify | 2 / 10 | 13.1 ns | 13.0 ns - 14.1 ns |
| Bun | complete | `warmResolveTransientFactory` | inversify-jit | 3 / 10 | 13.1 ns | 13.0 ns - 14.2 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 4 / 10 | 14.0 ns | 13.8 ns - 14.2 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload | 5 / 10 | 14.3 ns | 14.2 ns - 14.7 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di-codegen | 6 / 10 | 14.3 ns | 14.2 ns - 14.6 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di | 7 / 10 | 14.7 ns | 14.5 ns - 14.8 ns |
| Bun | complete | `warmResolveTransientFactory` | typedi | 8 / 10 | 17.9 ns | 17.7 ns - 18.9 ns |
| Bun | complete | `warmResolveTransientFactory` | typed-inject | 9 / 10 | 28.2 ns | 28.1 ns - 28.5 ns |
| Bun | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 52.6 ns | 51.6 ns - 53.0 ns |
| Bun | complete | `coldResolveTransientFactory` | typed-inject | 1 / 8 | 31.8 ns | 31.6 ns - 32.1 ns |
| Bun | complete | `coldResolveTransientFactory` | typedi | 2 / 8 | 37.7 ns | 36.2 ns - 38.4 ns |
| Bun | complete | `coldResolveTransientFactory` | awilix | 3 / 8 | 80.0 ns | 76.9 ns - 85.4 ns |
| Bun | complete | `coldResolveTransientFactory` | scope-di | 4 / 8 | 87.5 ns | 69.0 ns - 103.6 ns |
| Bun | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 116.8 ns | 100.8 ns - 119.5 ns |
| Bun | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 5.97 us | 5.90 us - 6.00 us |
| Bun | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 22.90 us | 22.70 us - 23.10 us |
| Bun | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 57.80 us | 57.50 us - 58.00 us |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 1 / 10 | 26.0 ns | 25.5 ns - 26.7 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 26.2 ns | 25.2 ns - 28.4 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify-jit | 3 / 10 | 27.1 ns | 26.2 ns - 27.8 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di | 4 / 10 | 27.8 ns | 27.6 ns - 28.2 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify | 5 / 10 | 27.8 ns | 27.7 ns - 28.2 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 6 / 10 | 29.7 ns | 27.7 ns - 31.0 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | awilix | 7 / 10 | 44.6 ns | 43.6 ns - 47.7 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | typedi | 8 / 10 | 51.0 ns | 50.6 ns - 51.2 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | typed-inject | 9 / 10 | 123.1 ns | 121.7 ns - 126.6 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 145.2 ns | 96.3 ns - 153.1 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di | 1 / 8 | 80.7 ns | 79.6 ns - 95.3 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | typedi | 2 / 8 | 82.3 ns | 79.8 ns - 83.9 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | typed-inject | 3 / 8 | 133.1 ns | 125.5 ns - 137.9 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | tsyringe | 4 / 8 | 187.8 ns | 181.4 ns - 239.6 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | awilix | 5 / 8 | 315.0 ns | 307.1 ns - 316.6 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 22.79 us | 21.95 us - 23.10 us |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 30.70 us | 30.40 us - 31.30 us |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 110.60 us | 110.10 us - 112.00 us |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 1 / 10 | 31.8 ns | 30.4 ns - 35.6 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 2 / 10 | 34.5 ns | 31.4 ns - 35.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 3 / 10 | 36.1 ns | 33.4 ns - 37.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 4 / 10 | 49.8 ns | 48.3 ns - 51.0 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 60.4 ns | 59.5 ns - 61.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 79.1 ns | 78.0 ns - 81.1 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 7 / 10 | 206.6 ns | 196.9 ns - 259.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 8 / 10 | 217.6 ns | 216.0 ns - 218.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 223.8 ns | 213.1 ns - 232.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 451.0 ns | 437.5 ns - 455.3 ns |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 177.0 ns | 168.6 ns - 180.8 ns |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 2 / 8 | 221.4 ns | 217.2 ns - 271.5 ns |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 3 / 8 | 480.7 ns | 470.9 ns - 495.5 ns |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 4 / 8 | 506.2 ns | 450.8 ns - 521.9 ns |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 5 / 8 | 997.6 ns | 965.7 ns - 1.09 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 6 / 8 | 33.20 us | 33.10 us - 33.50 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 7 / 8 | 48.43 us | 47.67 us - 48.94 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 148.90 us | 147.70 us - 149.70 us |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 38.6 ns | 38.1 ns - 41.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 40.3 ns | 39.9 ns - 40.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 3 / 10 | 66.9 ns | 66.5 ns - 70.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 4 / 10 | 69.5 ns | 69.0 ns - 70.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 5 / 10 | 75.3 ns | 74.6 ns - 76.2 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 6 / 10 | 77.0 ns | 76.2 ns - 78.0 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 7 / 10 | 239.9 ns | 213.5 ns - 258.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 258.0 ns | 255.5 ns - 260.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 9 / 10 | 310.4 ns | 236.3 ns - 311.1 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 535.9 ns | 533.5 ns - 546.6 ns |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 315.5 ns | 301.0 ns - 337.5 ns |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 2 / 8 | 320.1 ns | 258.8 ns - 329.5 ns |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 3 / 8 | 511.5 ns | 492.7 ns - 576.2 ns |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 4 / 8 | 588.7 ns | 567.3 ns - 603.7 ns |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 5 / 8 | 1.34 us | 1.21 us - 1.39 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 6 / 8 | 34.80 us | 34.10 us - 36.30 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 7 / 8 | 54.47 us | 51.24 us - 55.08 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 161.40 us | 159.80 us - 161.80 us |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 1 / 10 | 36.0 ns | 34.0 ns - 42.1 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 2 / 10 | 40.2 ns | 38.9 ns - 43.7 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 3 / 10 | 40.3 ns | 40.1 ns - 42.7 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 4 / 10 | 42.5 ns | 39.7 ns - 46.6 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 5 / 10 | 45.5 ns | 45.2 ns - 47.6 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify | 6 / 10 | 59.9 ns | 59.3 ns - 60.2 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | awilix | 7 / 10 | 133.6 ns | 125.0 ns - 134.5 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typedi | 8 / 10 | 185.0 ns | 183.3 ns - 186.1 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 9 / 10 | 216.5 ns | 207.0 ns - 217.9 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 231.0 ns | 229.0 ns - 257.6 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 206.9 ns | 204.4 ns - 225.1 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 2 / 8 | 228.7 ns | 227.2 ns - 241.0 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typedi | 3 / 8 | 241.2 ns | 237.0 ns - 248.1 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 4 / 8 | 526.3 ns | 499.5 ns - 554.2 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | awilix | 5 / 8 | 839.4 ns | 800.4 ns - 846.7 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify | 6 / 8 | 32.00 us | 31.00 us - 33.60 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 7 / 8 | 49.12 us | 47.63 us - 49.72 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 160.40 us | 158.70 us - 169.40 us |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 1 / 10 | 63.7 ns | 63.5 ns - 64.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 2 / 10 | 64.2 ns | 64.0 ns - 65.1 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 3 / 10 | 103.6 ns | 98.9 ns - 106.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 4 / 10 | 108.9 ns | 103.3 ns - 109.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 5 / 10 | 109.3 ns | 107.5 ns - 111.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 6 / 10 | 113.2 ns | 111.5 ns - 114.5 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 7 / 10 | 448.6 ns | 441.6 ns - 452.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 8 / 10 | 464.6 ns | 457.6 ns - 5.60 us |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 9 / 10 | 522.0 ns | 515.5 ns - 529.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 895.3 ns | 892.7 ns - 913.6 ns |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 478.4 ns | 467.5 ns - 484.9 ns |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 2 / 8 | 543.9 ns | 536.5 ns - 555.1 ns |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 3 / 8 | 958.4 ns | 920.1 ns - 979.5 ns |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 4 / 8 | 984.2 ns | 938.5 ns - 1.04 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 5 / 8 | 2.41 us | 2.34 us - 2.50 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 6 / 8 | 40.40 us | 40.10 us - 41.70 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 7 / 8 | 106.70 us | 106.00 us - 107.70 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 210.90 us | 209.50 us - 213.30 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 177.8 ns | 177.1 ns - 180.1 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 178.9 ns | 176.5 ns - 181.0 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 179.7 ns | 178.6 ns - 181.7 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 4 / 10 | 218.2 ns | 216.1 ns - 220.1 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 5 / 10 | 421.7 ns | 419.0 ns - 427.7 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 6 / 10 | 455.9 ns | 437.9 ns - 459.4 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 7 / 10 | 1.28 us | 1.25 us - 1.32 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 8 / 10 | 1.57 us | 1.54 us - 1.61 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 9 / 10 | 2.13 us | 2.10 us - 2.17 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 3.49 us | 3.43 us - 17.60 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 1.16 us | 1.15 us - 1.18 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 2 / 8 | 2.16 us | 2.12 us - 2.20 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 3 / 8 | 4.07 us | 4.03 us - 4.19 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 4 / 8 | 6.91 us | 6.64 us - 7.10 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 5 / 8 | 17.80 us | 3.89 us - 18.40 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 6 / 8 | 54.80 us | 54.50 us - 55.60 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 7 / 8 | 243.40 us | 242.40 us - 246.40 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 463.00 us | 458.00 us - 488.00 us |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 1 / 10 | 61.6 ns | 61.0 ns - 63.3 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 61.7 ns | 59.6 ns - 63.6 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 3 / 10 | 94.9 ns | 92.5 ns - 103.5 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify | 4 / 10 | 101.0 ns | 100.2 ns - 102.1 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 5 / 10 | 121.4 ns | 120.0 ns - 128.1 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 6 / 10 | 125.4 ns | 122.8 ns - 130.6 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | awilix | 7 / 10 | 125.7 ns | 124.4 ns - 130.0 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 8 / 10 | 162.8 ns | 155.5 ns - 165.0 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typedi | 9 / 10 | 193.6 ns | 191.3 ns - 227.4 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 356.0 ns | 351.7 ns - 360.2 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 176.8 ns | 176.0 ns - 180.5 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 2 / 10 | 177.6 ns | 174.4 ns - 178.8 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 197.7 ns | 191.6 ns - 199.1 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 4 / 10 | 217.7 ns | 215.6 ns - 218.6 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 5 / 10 | 400.2 ns | 395.8 ns - 405.7 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 442.2 ns | 418.4 ns - 450.7 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 7 / 10 | 589.0 ns | 584.0 ns - 612.6 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 8 / 10 | 803.4 ns | 792.5 ns - 7.30 us |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 9 / 10 | 1.23 us | 1.19 us - 1.30 us |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 10 / 10 | 1.42 us | 1.30 us - 1.44 us |

## Memory Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Allocations |
| --- | --- | --- | --- | ---: | ---: |
| Bun | complete | `registrationClass` | typed-inject | 1 / 9 | 180 B |
| Bun | complete | `registrationClass` | tsyringe | 2 / 9 | 404 B |
| Bun | complete | `registrationClass` | typedi | 3 / 9 | 533 B |
| Bun | complete | `registrationClass` | needle-di | 4 / 9 | 591 B |
| Bun | complete | `registrationClass` | scope-di | 5 / 9 | 1.25 KB |
| Bun | complete | `registrationClass` | scope-di-codegen | 6 / 9 | 1.26 KB |
| Bun | complete | `registrationClass` | awilix | 7 / 9 | 3.29 KB |
| Bun | complete | `registrationClass` | inversify-jit | 8 / 9 | 9.04 KB |
| Bun | complete | `registrationClass` | inversify | 9 / 9 | 9.28 KB |
| Bun | complete | `registrationValue` | typed-inject | 1 / 9 | 147 B |
| Bun | complete | `registrationValue` | needle-di | 2 / 9 | 157 B |
| Bun | complete | `registrationValue` | tsyringe | 3 / 9 | 326 B |
| Bun | complete | `registrationValue` | typedi | 4 / 9 | 504 B |
| Bun | complete | `registrationValue` | awilix | 5 / 9 | 691 B |
| Bun | complete | `registrationValue` | scope-di-codegen | 6 / 9 | 786 B |
| Bun | complete | `registrationValue` | scope-di | 7 / 9 | 921 B |
| Bun | complete | `registrationValue` | inversify-jit | 8 / 9 | 6.88 KB |
| Bun | complete | `registrationValue` | inversify | 9 / 9 | 7.07 KB |
| Bun | complete | `registrationFactory` | needle-di | 1 / 9 | 174 B |
| Bun | complete | `registrationFactory` | typed-inject | 2 / 9 | 194 B |
| Bun | complete | `registrationFactory` | tsyringe | 3 / 9 | 285 B |
| Bun | complete | `registrationFactory` | typedi | 4 / 9 | 505 B |
| Bun | complete | `registrationFactory` | scope-di | 5 / 9 | 919 B |
| Bun | complete | `registrationFactory` | scope-di-codegen | 6 / 9 | 967 B |
| Bun | complete | `registrationFactory` | awilix | 7 / 9 | 3.06 KB |
| Bun | complete | `registrationFactory` | inversify-jit | 8 / 9 | 6.68 KB |
| Bun | complete | `registrationFactory` | inversify | 9 / 9 | 7.96 KB |
| Bun | complete | `warmResolveValue` | typed-inject | 1 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | inversify-jit | 2 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | inversify | 3 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di-module-reload-codegen | 4 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di | 5 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di-codegen | 6 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | typedi | 7 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di-module-reload | 8 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | needle-di | 9 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | awilix | 10 / 11 | 1 B |
| Bun | complete | `warmResolveValue` | tsyringe | 11 / 11 | 1 B |
| Bun | complete | `coldResolveValue` | typed-inject | 1 / 9 | 0 B |
| Bun | complete | `coldResolveValue` | typedi | 2 / 9 | 0 B |
| Bun | complete | `coldResolveValue` | awilix | 3 / 9 | 0 B |
| Bun | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 1 B |
| Bun | complete | `coldResolveValue` | scope-di | 5 / 9 | 1 B |
| Bun | complete | `coldResolveValue` | needle-di | 6 / 9 | 2 B |
| Bun | complete | `coldResolveValue` | tsyringe | 7 / 9 | 3 B |
| Bun | complete | `coldResolveValue` | inversify | 8 / 9 | 551 B |
| Bun | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 568 B |
| Bun | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | inversify | 2 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | inversify-jit | 3 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | typedi | 4 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | awilix | 5 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload | 6 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di-codegen | 7 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di | 8 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 9 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | needle-di | 10 / 11 | 1 B |
| Bun | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | scope-di | 3 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | needle-di | 4 / 9 | 2 B |
| Bun | complete | `coldResolveSingletonClass` | typedi | 5 / 9 | 2 B |
| Bun | complete | `coldResolveSingletonClass` | awilix | 6 / 9 | 3 B |
| Bun | complete | `coldResolveSingletonClass` | tsyringe | 7 / 9 | 3 B |
| Bun | complete | `coldResolveSingletonClass` | inversify | 8 / 9 | 836 B |
| Bun | complete | `coldResolveSingletonClass` | inversify-jit | 9 / 9 | 939 B |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload | 1 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | inversify | 2 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | inversify-jit | 3 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 4 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | scope-di-codegen | 5 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | scope-di | 6 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 1 B |
| Bun | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 1 B |
| Bun | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 1 B |
| Bun | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 4 B |
| Bun | complete | `coldResolveTransientClass` | scope-di | 1 / 8 | 1 B |
| Bun | complete | `coldResolveTransientClass` | awilix | 2 / 8 | 1 B |
| Bun | complete | `coldResolveTransientClass` | typed-inject | 3 / 8 | 1 B |
| Bun | complete | `coldResolveTransientClass` | typedi | 4 / 8 | 2 B |
| Bun | complete | `coldResolveTransientClass` | tsyringe | 5 / 8 | 4 B |
| Bun | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 85 B |
| Bun | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 751 B |
| Bun | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 2.49 KB |
| Bun | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | inversify-jit | 2 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | inversify | 3 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di | 4 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 5 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-codegen | 6 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | typedi | 7 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 8 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | awilix | 9 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | needle-di | 10 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 0 B |
| Bun | complete | `coldResolveSingletonFactory` | scope-di | 2 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | typed-inject | 4 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | awilix | 5 / 9 | 2 B |
| Bun | complete | `coldResolveSingletonFactory` | needle-di | 6 / 9 | 3 B |
| Bun | complete | `coldResolveSingletonFactory` | tsyringe | 7 / 9 | 3 B |
| Bun | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 674 B |
| Bun | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 814 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 1 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 2 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 3 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 4 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 5 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 6 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 7 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 8 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 9 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di-codegen | 1 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di | 2 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | inversify | 3 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload | 4 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | inversify-jit | 5 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 6 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | awilix | 7 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | typedi | 8 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | typed-inject | 9 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 1 B |
| Bun | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 0 B |
| Bun | complete | `coldResolveTransientFactory` | awilix | 2 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactory` | scope-di | 3 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactory` | typed-inject | 4 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 3 B |
| Bun | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 83 B |
| Bun | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 699 B |
| Bun | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 2.13 KB |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify-jit | 1 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify | 2 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 3 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 4 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 5 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di | 6 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | tsyringe | 7 / 10 | 3 B |
| Bun | complete | `warmResolveTransientFactoryChain` | typedi | 8 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryChain` | awilix | 9 / 10 | 5 B |
| Bun | complete | `warmResolveTransientFactoryChain` | typed-inject | 10 / 10 | 7 B |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di | 1 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactoryChain` | typedi | 2 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactoryChain` | awilix | 3 / 8 | 2 B |
| Bun | complete | `coldResolveTransientFactoryChain` | typed-inject | 4 / 8 | 4 B |
| Bun | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify | 6 / 8 | 1.17 KB |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 7 / 8 | 2.91 KB |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 5.70 KB |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 1 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 2 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 3 / 10 | 2 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 4 / 10 | 2 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 7 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 7 / 10 | 23 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 8 / 10 | 23 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 9 / 10 | 28 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 28 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 1 / 8 | 2 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 2 / 8 | 4 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 3 / 8 | 12 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 4 / 8 | 20 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 5 / 8 | 28 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 6 / 8 | 1.75 KB |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 7 / 8 | 8.30 KB |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 8 / 8 | 11.61 KB |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 3 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 3 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 4 / 10 | 5 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 5 / 10 | 6 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 8 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 7 / 10 | 22 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 30 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 9 / 10 | 38 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 52 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 1 / 8 | 2 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 2 / 8 | 5 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 3 / 8 | 9 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 4 / 8 | 22 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 5 / 8 | 42 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 6 / 8 | 1.53 KB |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 7 / 8 | 8.50 KB |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 8 / 8 | 8.63 KB |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 1 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify | 2 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 3 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 4 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 5 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 6 / 10 | 2 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 7 / 10 | 14 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typedi | 8 / 10 | 17 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | awilix | 9 / 10 | 19 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 10 / 10 | 19 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | awilix | 1 / 8 | 3 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 3 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 3 / 8 | 3 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 4 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 23 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify | 6 / 8 | 1.53 KB |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 7 / 8 | 8.83 KB |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 8 / 8 | 11.03 KB |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 1 / 10 | 6 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 2 / 10 | 7 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 3 / 10 | 11 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 4 / 10 | 11 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 5 / 10 | 14 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 17 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 7 / 10 | 50 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 8 / 10 | 55 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 9 / 10 | 56 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 76 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 1 / 8 | 5 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 2 / 8 | 9 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 3 / 8 | 29 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 4 / 8 | 109 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 5 / 8 | 226 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 6 / 8 | 1.15 KB |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 7 / 8 | 2.35 KB |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 9.99 KB |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 10 | 28 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 2 / 10 | 31 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 3 / 10 | 34 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 4 / 10 | 35 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 5 / 10 | 42 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 6 / 10 | 70 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 7 / 10 | 72 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 8 / 10 | 74 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 9 / 10 | 98 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 10 / 10 | 163 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 24 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 2 / 8 | 55 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 3 / 8 | 161 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 4 / 8 | 552 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 5 / 8 | 613 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 6 / 8 | 2.81 KB |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 7 / 8 | 3.41 KB |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 20.57 KB |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 2 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 2 / 10 | 2 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 3 / 10 | 2 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 4 / 10 | 3 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify | 5 / 10 | 3 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 6 / 10 | 4 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 7 / 10 | 6 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | awilix | 8 / 10 | 9 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 9 / 10 | 9 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typedi | 10 / 10 | 17 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 1 / 10 | 5 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 2 / 10 | 10 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 3 / 10 | 11 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 4 / 10 | 12 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 5 / 10 | 14 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 6 / 10 | 27 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 7 / 10 | 32 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 8 / 10 | 37 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 9 / 10 | 39 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 10 / 10 | 102 B |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Registrations per batch | Result file |
| --- | --- | --- | --- | ---: | --- |
| Bun | 1.4.2 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26300 x64 | complete | 300 | [`bench_bun_json_complete.json`](./bench_bun_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [7de000ef198459b0a478103290b40a43dc266e0e](https://github.com/SvS-tm/scope-di/commit/7de000ef198459b0a478103290b40a43dc266e0e) |
| Branch | chore/benchmarks-alien |
