# Deno Benchmark Report

[Scope DI startup report](./bench_deno_json_complete.startup.md)

Each case is measured in fresh processes. Time is the median of process medians; the range shows the minimum and maximum process medians. Allocations are the median of process allocation averages. Raw JSON retains every process measurement.

Library results were collected independently. Rankings compare the case measurements below.

- [scope-di raw results](bench_deno_json_complete/scope-di.json)
- [inversify raw results](bench_deno_json_complete/inversify.json)
- [tsyringe raw results](bench_deno_json_complete/tsyringe.json)
- [awilix raw results](bench_deno_json_complete/awilix.json)
- [typedi raw results](bench_deno_json_complete/typedi.json)
- [typed-inject raw results](bench_deno_json_complete/typed-inject.json)
- [needle-di raw results](bench_deno_json_complete/needle-di.json)

## Speed Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Time | Process median range |
| --- | --- | --- | --- | ---: | ---: | --- |
| Deno | complete | `registrationClass` | tsyringe | 1 / 9 | 93.20 us | 91.50 us - 96.40 us |
| Deno | complete | `registrationClass` | typed-inject | 2 / 9 | 190.10 us | 186.00 us - 341.90 us |
| Deno | complete | `registrationClass` | needle-di | 3 / 9 | 206.50 us | 196.50 us - 290.50 us |
| Deno | complete | `registrationClass` | scope-di | 4 / 9 | 223.70 us | 216.20 us - 260.20 us |
| Deno | complete | `registrationClass` | scope-di-codegen | 5 / 9 | 226.60 us | 224.80 us - 237.80 us |
| Deno | complete | `registrationClass` | typedi | 6 / 9 | 244.30 us | 230.30 us - 350.60 us |
| Deno | complete | `registrationClass` | awilix | 7 / 9 | 833.20 us | 822.20 us - 847.80 us |
| Deno | complete | `registrationClass` | inversify-jit | 8 / 9 | 1.77 ms | 1.75 ms - 1.89 ms |
| Deno | complete | `registrationClass` | inversify | 9 / 9 | 1.78 ms | 1.76 ms - 1.84 ms |
| Deno | complete | `registrationValue` | tsyringe | 1 / 9 | 16.80 us | 15.80 us - 17.20 us |
| Deno | complete | `registrationValue` | needle-di | 2 / 9 | 81.80 us | 78.40 us - 82.20 us |
| Deno | complete | `registrationValue` | typed-inject | 3 / 9 | 98.20 us | 94.70 us - 100.20 us |
| Deno | complete | `registrationValue` | typedi | 4 / 9 | 114.70 us | 113.60 us - 117.10 us |
| Deno | complete | `registrationValue` | scope-di | 5 / 9 | 128.50 us | 126.60 us - 150.70 us |
| Deno | complete | `registrationValue` | scope-di-codegen | 6 / 9 | 129.20 us | 124.00 us - 129.80 us |
| Deno | complete | `registrationValue` | awilix | 7 / 9 | 266.00 us | 262.10 us - 268.20 us |
| Deno | complete | `registrationValue` | inversify | 8 / 9 | 1.49 ms | 1.47 ms - 1.51 ms |
| Deno | complete | `registrationValue` | inversify-jit | 9 / 9 | 1.50 ms | 1.47 ms - 1.51 ms |
| Deno | complete | `registrationFactory` | tsyringe | 1 / 9 | 18.10 us | 17.30 us - 18.30 us |
| Deno | complete | `registrationFactory` | needle-di | 2 / 9 | 85.40 us | 82.40 us - 88.20 us |
| Deno | complete | `registrationFactory` | typed-inject | 3 / 9 | 101.90 us | 97.10 us - 104.70 us |
| Deno | complete | `registrationFactory` | scope-di-codegen | 4 / 9 | 133.40 us | 131.10 us - 143.30 us |
| Deno | complete | `registrationFactory` | scope-di | 5 / 9 | 135.80 us | 131.20 us - 143.30 us |
| Deno | complete | `registrationFactory` | typedi | 6 / 9 | 141.40 us | 108.90 us - 142.50 us |
| Deno | complete | `registrationFactory` | awilix | 7 / 9 | 368.70 us | 359.50 us - 371.80 us |
| Deno | complete | `registrationFactory` | inversify | 8 / 9 | 1.57 ms | 1.56 ms - 1.59 ms |
| Deno | complete | `registrationFactory` | inversify-jit | 9 / 9 | 1.58 ms | 1.55 ms - 1.60 ms |
| Deno | complete | `warmResolveValue` | typed-inject | 1 / 11 | 0.5 ns | 0.5 ns - 0.5 ns |
| Deno | complete | `warmResolveValue` | typedi | 2 / 11 | 6.9 ns | 6.8 ns - 6.9 ns |
| Deno | complete | `warmResolveValue` | inversify-jit | 3 / 11 | 8.6 ns | 8.5 ns - 8.9 ns |
| Deno | complete | `warmResolveValue` | inversify | 4 / 11 | 8.8 ns | 8.5 ns - 9.0 ns |
| Deno | complete | `warmResolveValue` | awilix | 5 / 11 | 10.1 ns | 9.6 ns - 10.4 ns |
| Deno | complete | `warmResolveValue` | scope-di-module-reload | 6 / 11 | 11.9 ns | 11.8 ns - 11.9 ns |
| Deno | complete | `warmResolveValue` | scope-di | 7 / 11 | 12.0 ns | 11.7 ns - 12.0 ns |
| Deno | complete | `warmResolveValue` | scope-di-codegen | 8 / 11 | 12.0 ns | 11.8 ns - 12.1 ns |
| Deno | complete | `warmResolveValue` | scope-di-module-reload-codegen | 9 / 11 | 12.0 ns | 11.8 ns - 12.0 ns |
| Deno | complete | `warmResolveValue` | needle-di | 10 / 11 | 17.1 ns | 17.0 ns - 17.2 ns |
| Deno | complete | `warmResolveValue` | tsyringe | 11 / 11 | 92.6 ns | 86.1 ns - 95.1 ns |
| Deno | complete | `coldResolveValue` | typed-inject | 1 / 9 | 5.7 ns | 5.5 ns - 5.7 ns |
| Deno | complete | `coldResolveValue` | typedi | 2 / 9 | 13.5 ns | 12.3 ns - 15.3 ns |
| Deno | complete | `coldResolveValue` | scope-di-codegen | 3 / 9 | 38.9 ns | 37.2 ns - 40.2 ns |
| Deno | complete | `coldResolveValue` | scope-di | 4 / 9 | 39.3 ns | 36.5 ns - 40.0 ns |
| Deno | complete | `coldResolveValue` | awilix | 5 / 9 | 84.7 ns | 82.6 ns - 85.3 ns |
| Deno | complete | `coldResolveValue` | tsyringe | 6 / 9 | 175.3 ns | 157.0 ns - 178.0 ns |
| Deno | complete | `coldResolveValue` | needle-di | 7 / 9 | 407.8 ns | 404.6 ns - 410.3 ns |
| Deno | complete | `coldResolveValue` | inversify | 8 / 9 | 28.50 us | 26.70 us - 29.50 us |
| Deno | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 29.40 us | 27.30 us - 32.00 us |
| Deno | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 0.6 ns | 0.5 ns - 0.6 ns |
| Deno | complete | `warmResolveSingletonClass` | typedi | 2 / 11 | 6.9 ns | 6.9 ns - 7.0 ns |
| Deno | complete | `warmResolveSingletonClass` | inversify | 3 / 11 | 8.3 ns | 8.2 ns - 8.3 ns |
| Deno | complete | `warmResolveSingletonClass` | inversify-jit | 4 / 11 | 8.3 ns | 8.3 ns - 8.5 ns |
| Deno | complete | `warmResolveSingletonClass` | awilix | 5 / 11 | 8.5 ns | 8.4 ns - 8.8 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di | 6 / 11 | 11.9 ns | 11.9 ns - 12.2 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 7 / 11 | 12.0 ns | 11.8 ns - 12.1 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di-codegen | 8 / 11 | 12.0 ns | 11.9 ns - 12.1 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload | 9 / 11 | 12.0 ns | 11.9 ns - 12.0 ns |
| Deno | complete | `warmResolveSingletonClass` | needle-di | 10 / 11 | 16.8 ns | 15.9 ns - 17.1 ns |
| Deno | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 57.3 ns | 55.7 ns - 57.9 ns |
| Deno | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 38.3 ns | 36.0 ns - 39.6 ns |
| Deno | complete | `coldResolveSingletonClass` | scope-di | 2 / 9 | 49.2 ns | 48.6 ns - 50.7 ns |
| Deno | complete | `coldResolveSingletonClass` | scope-di-codegen | 3 / 9 | 49.6 ns | 47.6 ns - 73.6 ns |
| Deno | complete | `coldResolveSingletonClass` | typedi | 4 / 9 | 131.8 ns | 128.3 ns - 134.4 ns |
| Deno | complete | `coldResolveSingletonClass` | awilix | 5 / 9 | 152.0 ns | 150.5 ns - 155.1 ns |
| Deno | complete | `coldResolveSingletonClass` | tsyringe | 6 / 9 | 206.8 ns | 201.2 ns - 213.3 ns |
| Deno | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 408.9 ns | 406.6 ns - 415.6 ns |
| Deno | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 37.00 us | 35.30 us - 39.60 us |
| Deno | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 37.20 us | 36.80 us - 38.50 us |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 1 / 10 | 7.7 ns | 7.7 ns - 7.7 ns |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload | 2 / 10 | 7.7 ns | 7.7 ns - 7.8 ns |
| Deno | complete | `warmResolveTransientClass` | scope-di | 3 / 10 | 7.8 ns | 7.8 ns - 8.2 ns |
| Deno | complete | `warmResolveTransientClass` | scope-di-codegen | 4 / 10 | 7.8 ns | 7.7 ns - 7.9 ns |
| Deno | complete | `warmResolveTransientClass` | inversify-jit | 5 / 10 | 9.5 ns | 9.4 ns - 9.5 ns |
| Deno | complete | `warmResolveTransientClass` | inversify | 6 / 10 | 9.8 ns | 9.6 ns - 10.0 ns |
| Deno | complete | `warmResolveTransientClass` | awilix | 7 / 10 | 13.6 ns | 13.5 ns - 14.0 ns |
| Deno | complete | `warmResolveTransientClass` | typed-inject | 8 / 10 | 14.6 ns | 14.3 ns - 15.1 ns |
| Deno | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 74.3 ns | 71.3 ns - 112.4 ns |
| Deno | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 124.0 ns | 123.2 ns - 124.9 ns |
| Deno | complete | `coldResolveTransientClass` | typed-inject | 1 / 8 | 17.1 ns | 16.8 ns - 17.3 ns |
| Deno | complete | `coldResolveTransientClass` | scope-di | 2 / 8 | 26.2 ns | 25.6 ns - 26.6 ns |
| Deno | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 119.3 ns | 115.1 ns - 121.7 ns |
| Deno | complete | `coldResolveTransientClass` | awilix | 4 / 8 | 137.3 ns | 135.7 ns - 139.4 ns |
| Deno | complete | `coldResolveTransientClass` | tsyringe | 5 / 8 | 195.5 ns | 184.5 ns - 197.6 ns |
| Deno | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 6.69 us | 6.46 us - 6.81 us |
| Deno | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 35.40 us | 33.50 us - 37.60 us |
| Deno | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 88.20 us | 82.30 us - 92.90 us |
| Deno | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 0.6 ns | 0.5 ns - 0.6 ns |
| Deno | complete | `warmResolveSingletonFactory` | typedi | 2 / 11 | 6.8 ns | 6.8 ns - 7.1 ns |
| Deno | complete | `warmResolveSingletonFactory` | inversify-jit | 3 / 11 | 8.3 ns | 8.2 ns - 8.4 ns |
| Deno | complete | `warmResolveSingletonFactory` | inversify | 4 / 11 | 8.3 ns | 8.3 ns - 8.4 ns |
| Deno | complete | `warmResolveSingletonFactory` | awilix | 5 / 11 | 8.5 ns | 8.4 ns - 8.9 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 6 / 11 | 11.9 ns | 11.8 ns - 12.1 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di | 7 / 11 | 11.9 ns | 11.9 ns - 12.0 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-codegen | 8 / 11 | 12.0 ns | 11.9 ns - 12.6 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 9 / 11 | 12.0 ns | 11.9 ns - 12.2 ns |
| Deno | complete | `warmResolveSingletonFactory` | needle-di | 10 / 11 | 17.0 ns | 16.1 ns - 17.1 ns |
| Deno | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 57.8 ns | 56.1 ns - 88.8 ns |
| Deno | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 18.5 ns | 16.7 ns - 20.7 ns |
| Deno | complete | `coldResolveSingletonFactory` | typed-inject | 2 / 9 | 31.0 ns | 28.5 ns - 31.2 ns |
| Deno | complete | `coldResolveSingletonFactory` | scope-di | 3 / 9 | 39.7 ns | 38.3 ns - 43.9 ns |
| Deno | complete | `coldResolveSingletonFactory` | scope-di-codegen | 4 / 9 | 39.7 ns | 38.0 ns - 42.4 ns |
| Deno | complete | `coldResolveSingletonFactory` | awilix | 5 / 9 | 139.5 ns | 136.3 ns - 141.7 ns |
| Deno | complete | `coldResolveSingletonFactory` | tsyringe | 6 / 9 | 173.8 ns | 144.5 ns - 203.3 ns |
| Deno | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 424.0 ns | 422.5 ns - 432.6 ns |
| Deno | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 33.30 us | 31.50 us - 33.90 us |
| Deno | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 34.60 us | 34.10 us - 35.80 us |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 1 / 10 | 14.3 ns | 13.9 ns - 14.7 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 2 / 10 | 14.8 ns | 14.6 ns - 14.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 3 / 10 | 15.3 ns | 15.3 ns - 15.4 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 4 / 10 | 15.8 ns | 15.1 ns - 16.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 5 / 10 | 19.9 ns | 18.8 ns - 20.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 6 / 10 | 20.8 ns | 20.4 ns - 21.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 7 / 10 | 20.8 ns | 20.8 ns - 21.4 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 8 / 10 | 21.0 ns | 20.6 ns - 21.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 9 / 10 | 23.8 ns | 21.3 ns - 24.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 102.5 ns | 62.1 ns - 105.0 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di-codegen | 1 / 10 | 8.0 ns | 8.0 ns - 8.1 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload | 2 / 10 | 8.0 ns | 7.9 ns - 8.1 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 3 / 10 | 8.1 ns | 7.9 ns - 8.5 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di | 4 / 10 | 8.2 ns | 8.0 ns - 8.3 ns |
| Deno | complete | `warmResolveTransientFactory` | inversify-jit | 5 / 10 | 9.8 ns | 9.7 ns - 10.4 ns |
| Deno | complete | `warmResolveTransientFactory` | inversify | 6 / 10 | 10.0 ns | 9.8 ns - 10.2 ns |
| Deno | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 13.1 ns | 12.8 ns - 13.7 ns |
| Deno | complete | `warmResolveTransientFactory` | typed-inject | 8 / 10 | 13.9 ns | 13.5 ns - 14.1 ns |
| Deno | complete | `warmResolveTransientFactory` | awilix | 9 / 10 | 14.3 ns | 14.3 ns - 15.4 ns |
| Deno | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 65.6 ns | 59.6 ns - 98.3 ns |
| Deno | complete | `coldResolveTransientFactory` | typed-inject | 1 / 8 | 16.6 ns | 16.4 ns - 17.0 ns |
| Deno | complete | `coldResolveTransientFactory` | typedi | 2 / 8 | 16.9 ns | 16.7 ns - 17.2 ns |
| Deno | complete | `coldResolveTransientFactory` | scope-di | 3 / 8 | 28.1 ns | 27.3 ns - 28.6 ns |
| Deno | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 125.7 ns | 123.3 ns - 128.3 ns |
| Deno | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 174.2 ns | 170.9 ns - 180.2 ns |
| Deno | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 6.67 us | 6.46 us - 6.82 us |
| Deno | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 33.60 us | 32.70 us - 34.90 us |
| Deno | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 89.00 us | 87.80 us - 95.10 us |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 1 / 10 | 18.3 ns | 18.2 ns - 18.8 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 18.6 ns | 18.2 ns - 19.5 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 3 / 10 | 19.9 ns | 19.6 ns - 20.0 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify-jit | 4 / 10 | 29.5 ns | 28.8 ns - 31.4 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di | 5 / 10 | 36.7 ns | 36.4 ns - 37.2 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | typedi | 6 / 10 | 39.8 ns | 39.6 ns - 40.6 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify | 7 / 10 | 43.7 ns | 43.4 ns - 44.1 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | typed-inject | 8 / 10 | 62.7 ns | 60.4 ns - 63.5 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | awilix | 9 / 10 | 79.9 ns | 77.3 ns - 82.0 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 195.2 ns | 179.7 ns - 270.2 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 48.3 ns | 47.4 ns - 49.7 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | typed-inject | 2 / 8 | 74.7 ns | 72.3 ns - 76.0 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di | 3 / 8 | 110.8 ns | 99.0 ns - 112.6 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | awilix | 4 / 8 | 285.7 ns | 282.0 ns - 302.7 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 455.5 ns | 452.0 ns - 462.5 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 21.90 us | 21.63 us - 22.31 us |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 42.00 us | 41.00 us - 44.20 us |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 155.60 us | 152.20 us - 165.50 us |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 1 / 10 | 33.4 ns | 33.2 ns - 33.4 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 2 / 10 | 33.5 ns | 32.4 ns - 33.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 3 / 10 | 36.0 ns | 35.4 ns - 36.0 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 4 / 10 | 36.4 ns | 36.0 ns - 36.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 64.7 ns | 63.2 ns - 65.7 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 75.2 ns | 72.8 ns - 81.3 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 7 / 10 | 159.6 ns | 156.5 ns - 163.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 8 / 10 | 198.2 ns | 194.5 ns - 201.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 444.2 ns | 416.4 ns - 571.3 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 585.7 ns | 579.4 ns - 602.6 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 124.7 ns | 123.1 ns - 134.0 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 2 / 8 | 183.3 ns | 178.4 ns - 189.1 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 3 / 8 | 607.0 ns | 595.6 ns - 611.3 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 4 / 8 | 743.8 ns | 713.1 ns - 755.9 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 5 / 8 | 1.08 us | 917.4 ns - 1.16 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 6 / 8 | 43.77 us | 43.44 us - 44.42 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 48.50 us | 47.00 us - 51.80 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 201.60 us | 198.20 us - 225.40 us |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 1 / 10 | 40.6 ns | 40.3 ns - 41.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 2 / 10 | 41.9 ns | 41.8 ns - 43.4 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 3 / 10 | 61.5 ns | 61.3 ns - 61.7 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 64.7 ns | 64.5 ns - 65.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 72.0 ns | 70.8 ns - 74.3 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 81.6 ns | 80.6 ns - 82.7 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 7 / 10 | 184.7 ns | 180.1 ns - 185.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 236.5 ns | 232.5 ns - 240.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 454.9 ns | 431.0 ns - 529.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 704.4 ns | 692.2 ns - 713.5 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 197.9 ns | 190.4 ns - 208.3 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 2 / 8 | 216.3 ns | 210.3 ns - 217.5 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 3 / 8 | 715.3 ns | 703.8 ns - 725.7 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 4 / 8 | 898.9 ns | 873.0 ns - 946.9 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 998.0 ns | 978.1 ns - 1.00 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 6 / 8 | 51.02 us | 50.34 us - 51.72 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 51.30 us | 44.10 us - 52.00 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 227.00 us | 217.80 us - 247.50 us |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 1 / 10 | 30.4 ns | 30.1 ns - 31.1 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 2 / 10 | 30.5 ns | 30.2 ns - 31.2 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 34.0 ns | 33.8 ns - 34.5 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 60.5 ns | 59.4 ns - 61.8 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify | 5 / 10 | 97.2 ns | 95.3 ns - 99.4 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 6 / 10 | 128.3 ns | 125.5 ns - 128.8 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 7 / 10 | 170.2 ns | 166.2 ns - 176.6 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typedi | 8 / 10 | 231.2 ns | 226.3 ns - 233.7 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | awilix | 9 / 10 | 269.6 ns | 259.5 ns - 274.4 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 394.3 ns | 332.9 ns - 576.5 ns |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 1 / 8 | 197.6 ns | 188.6 ns - 202.9 ns |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 241.5 ns | 232.3 ns - 246.8 ns |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 3 / 8 | 317.1 ns | 303.8 ns - 318.8 ns |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | awilix | 4 / 8 | 738.3 ns | 735.7 ns - 769.4 ns |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 980.9 ns | 909.9 ns - 1.07 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 44.86 us | 44.49 us - 46.62 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 52.80 us | 50.90 us - 55.10 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 232.40 us | 211.60 us - 239.40 us |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 1 / 10 | 65.2 ns | 64.4 ns - 66.4 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 2 / 10 | 67.4 ns | 65.4 ns - 68.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 3 / 10 | 92.5 ns | 91.1 ns - 99.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 4 / 10 | 98.6 ns | 98.2 ns - 100.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 5 / 10 | 109.5 ns | 103.6 ns - 115.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 111.9 ns | 107.2 ns - 117.0 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 7 / 10 | 313.7 ns | 296.8 ns - 317.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 8 / 10 | 378.4 ns | 375.5 ns - 389.3 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 780.8 ns | 765.3 ns - 824.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 1.16 us | 1.13 us - 1.18 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 229.9 ns | 212.8 ns - 233.9 ns |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 2 / 8 | 394.1 ns | 389.2 ns - 416.0 ns |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 3 / 8 | 1.22 us | 1.19 us - 1.22 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 4 / 8 | 1.37 us | 1.32 us - 1.47 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 5 / 8 | 2.11 us | 2.05 us - 2.13 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 6 / 8 | 55.60 us | 53.10 us - 60.70 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 7 / 8 | 122.70 us | 121.00 us - 123.70 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 284.10 us | 271.70 us - 303.70 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 159.2 ns | 154.5 ns - 160.5 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 160.0 ns | 156.2 ns - 163.5 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 223.2 ns | 222.0 ns - 225.0 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 4 / 10 | 513.8 ns | 505.0 ns - 537.4 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 5 / 10 | 536.9 ns | 479.2 ns - 556.1 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 559.1 ns | 550.3 ns - 570.9 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 7 / 10 | 1.01 us | 990.7 ns - 1.02 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 8 / 10 | 1.29 us | 1.27 us - 1.30 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 9 / 10 | 1.97 us | 1.93 us - 1.99 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 4.27 us | 4.20 us - 4.34 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 1.12 us | 1.11 us - 1.14 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 2 / 8 | 1.99 us | 1.97 us - 1.99 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 3 / 8 | 4.43 us | 4.33 us - 4.51 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 4 / 8 | 4.95 us | 4.71 us - 5.05 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 5 / 8 | 6.63 us | 6.47 us - 6.96 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 6 / 8 | 86.00 us | 79.70 us - 97.70 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 7 / 8 | 275.90 us | 275.50 us - 284.30 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 622.10 us | 605.00 us - 653.60 us |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify | 1 / 10 | 105.3 ns | 102.3 ns - 115.0 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 109.9 ns | 106.3 ns - 116.1 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 3 / 10 | 110.4 ns | 104.5 ns - 119.4 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 4 / 10 | 113.5 ns | 108.7 ns - 125.7 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typedi | 5 / 10 | 114.7 ns | 113.9 ns - 115.2 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 6 / 10 | 122.3 ns | 122.2 ns - 124.8 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 7 / 10 | 124.1 ns | 122.6 ns - 131.8 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 8 / 10 | 132.9 ns | 131.7 ns - 134.4 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 255.4 ns | 254.6 ns - 259.0 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 642.2 ns | 634.4 ns - 675.4 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 272.5 ns | 266.4 ns - 277.2 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 272.7 ns | 268.0 ns - 276.8 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 343.9 ns | 337.5 ns - 354.8 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 4 / 10 | 377.1 ns | 372.6 ns - 382.9 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 5 / 10 | 522.8 ns | 479.3 ns - 584.0 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 548.0 ns | 544.8 ns - 557.8 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 7 / 10 | 719.4 ns | 714.8 ns - 720.8 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 8 / 10 | 754.3 ns | 739.2 ns - 759.2 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 9 / 10 | 1.44 us | 1.43 us - 1.48 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 1.70 us | 1.64 us - 1.71 us |

## Memory Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Allocations |
| --- | --- | --- | --- | ---: | ---: |
| Deno | complete | `registrationClass` | typedi | 1 / 9 | 240.52 KB |
| Deno | complete | `registrationClass` | tsyringe | 2 / 9 | 278.27 KB |
| Deno | complete | `registrationClass` | typed-inject | 3 / 9 | 283.48 KB |
| Deno | complete | `registrationClass` | needle-di | 4 / 9 | 364.55 KB |
| Deno | complete | `registrationClass` | scope-di | 5 / 9 | 517.21 KB |
| Deno | complete | `registrationClass` | scope-di-codegen | 6 / 9 | 548.88 KB |
| Deno | complete | `registrationClass` | awilix | 7 / 9 | 1.33 MB |
| Deno | complete | `registrationClass` | inversify | 8 / 9 | 3.52 MB |
| Deno | complete | `registrationClass` | inversify-jit | 9 / 9 | 3.52 MB |
| Deno | complete | `registrationValue` | typedi | 1 / 9 | 118.42 KB |
| Deno | complete | `registrationValue` | tsyringe | 2 / 9 | 133.96 KB |
| Deno | complete | `registrationValue` | needle-di | 3 / 9 | 135.09 KB |
| Deno | complete | `registrationValue` | typed-inject | 4 / 9 | 139.81 KB |
| Deno | complete | `registrationValue` | awilix | 5 / 9 | 301.81 KB |
| Deno | complete | `registrationValue` | scope-di-codegen | 6 / 9 | 359.08 KB |
| Deno | complete | `registrationValue` | scope-di | 7 / 9 | 360.04 KB |
| Deno | complete | `registrationValue` | inversify | 8 / 9 | 3.11 MB |
| Deno | complete | `registrationValue` | inversify-jit | 9 / 9 | 3.11 MB |
| Deno | complete | `registrationFactory` | typedi | 1 / 9 | 105.02 KB |
| Deno | complete | `registrationFactory` | needle-di | 2 / 9 | 130.37 KB |
| Deno | complete | `registrationFactory` | typed-inject | 3 / 9 | 139.67 KB |
| Deno | complete | `registrationFactory` | tsyringe | 4 / 9 | 165.30 KB |
| Deno | complete | `registrationFactory` | scope-di-codegen | 5 / 9 | 360.57 KB |
| Deno | complete | `registrationFactory` | scope-di | 6 / 9 | 361.06 KB |
| Deno | complete | `registrationFactory` | awilix | 7 / 9 | 1.06 MB |
| Deno | complete | `registrationFactory` | inversify | 8 / 9 | 3.19 MB |
| Deno | complete | `registrationFactory` | inversify-jit | 9 / 9 | 3.19 MB |
| Deno | complete | `warmResolveValue` | typed-inject | 1 / 11 | 1 B |
| Deno | complete | `warmResolveValue` | scope-di-module-reload-codegen | 2 / 11 | 1 B |
| Deno | complete | `warmResolveValue` | scope-di-codegen | 3 / 11 | 1 B |
| Deno | complete | `warmResolveValue` | scope-di-module-reload | 4 / 11 | 1 B |
| Deno | complete | `warmResolveValue` | scope-di | 5 / 11 | 2 B |
| Deno | complete | `warmResolveValue` | needle-di | 6 / 11 | 4 B |
| Deno | complete | `warmResolveValue` | typedi | 7 / 11 | 7 B |
| Deno | complete | `warmResolveValue` | inversify-jit | 8 / 11 | 49 B |
| Deno | complete | `warmResolveValue` | inversify | 9 / 11 | 49 B |
| Deno | complete | `warmResolveValue` | awilix | 10 / 11 | 98 B |
| Deno | complete | `warmResolveValue` | tsyringe | 11 / 11 | 235 B |
| Deno | complete | `coldResolveValue` | typed-inject | 1 / 9 | 1 B |
| Deno | complete | `coldResolveValue` | typedi | 2 / 9 | 10 B |
| Deno | complete | `coldResolveValue` | scope-di | 3 / 9 | 25 B |
| Deno | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 27 B |
| Deno | complete | `coldResolveValue` | awilix | 5 / 9 | 252 B |
| Deno | complete | `coldResolveValue` | tsyringe | 6 / 9 | 290 B |
| Deno | complete | `coldResolveValue` | needle-di | 7 / 9 | 622 B |
| Deno | complete | `coldResolveValue` | inversify | 8 / 9 | 5.61 KB |
| Deno | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 5.85 KB |
| Deno | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload | 2 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di-codegen | 3 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 4 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di | 5 / 11 | 2 B |
| Deno | complete | `warmResolveSingletonClass` | inversify | 6 / 11 | 2 B |
| Deno | complete | `warmResolveSingletonClass` | inversify-jit | 7 / 11 | 2 B |
| Deno | complete | `warmResolveSingletonClass` | needle-di | 8 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | typedi | 9 / 11 | 8 B |
| Deno | complete | `warmResolveSingletonClass` | awilix | 10 / 11 | 58 B |
| Deno | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 222 B |
| Deno | complete | `coldResolveSingletonClass` | scope-di-codegen | 1 / 9 | 52 B |
| Deno | complete | `coldResolveSingletonClass` | scope-di | 2 / 9 | 54 B |
| Deno | complete | `coldResolveSingletonClass` | typed-inject | 3 / 9 | 148 B |
| Deno | complete | `coldResolveSingletonClass` | awilix | 4 / 9 | 325 B |
| Deno | complete | `coldResolveSingletonClass` | tsyringe | 5 / 9 | 466 B |
| Deno | complete | `coldResolveSingletonClass` | typedi | 6 / 9 | 472 B |
| Deno | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 634 B |
| Deno | complete | `coldResolveSingletonClass` | inversify | 8 / 9 | 7.98 KB |
| Deno | complete | `coldResolveSingletonClass` | inversify-jit | 9 / 9 | 8.02 KB |
| Deno | complete | `warmResolveTransientClass` | scope-di-codegen | 1 / 10 | 25 B |
| Deno | complete | `warmResolveTransientClass` | scope-di | 2 / 10 | 25 B |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 3 / 10 | 25 B |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload | 4 / 10 | 25 B |
| Deno | complete | `warmResolveTransientClass` | inversify | 5 / 10 | 26 B |
| Deno | complete | `warmResolveTransientClass` | inversify-jit | 6 / 10 | 26 B |
| Deno | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 114 B |
| Deno | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 123 B |
| Deno | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 355 B |
| Deno | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 451 B |
| Deno | complete | `coldResolveTransientClass` | scope-di | 1 / 8 | 39 B |
| Deno | complete | `coldResolveTransientClass` | typed-inject | 2 / 8 | 115 B |
| Deno | complete | `coldResolveTransientClass` | awilix | 3 / 8 | 282 B |
| Deno | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 430 B |
| Deno | complete | `coldResolveTransientClass` | typedi | 5 / 8 | 465 B |
| Deno | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 475 B |
| Deno | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 7.70 KB |
| Deno | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 11.39 KB |
| Deno | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 2 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di | 3 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 4 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-codegen | 5 / 11 | 1 B |
| Deno | complete | `warmResolveSingletonFactory` | inversify | 6 / 11 | 2 B |
| Deno | complete | `warmResolveSingletonFactory` | inversify-jit | 7 / 11 | 2 B |
| Deno | complete | `warmResolveSingletonFactory` | needle-di | 8 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonFactory` | typedi | 9 / 11 | 7 B |
| Deno | complete | `warmResolveSingletonFactory` | awilix | 10 / 11 | 58 B |
| Deno | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 231 B |
| Deno | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 12 B |
| Deno | complete | `coldResolveSingletonFactory` | scope-di | 2 / 9 | 28 B |
| Deno | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 29 B |
| Deno | complete | `coldResolveSingletonFactory` | typed-inject | 4 / 9 | 125 B |
| Deno | complete | `coldResolveSingletonFactory` | awilix | 5 / 9 | 294 B |
| Deno | complete | `coldResolveSingletonFactory` | tsyringe | 6 / 9 | 294 B |
| Deno | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 609 B |
| Deno | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 6.69 KB |
| Deno | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 7.74 KB |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 1 / 10 | 41 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 2 / 10 | 42 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 3 / 10 | 42 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 4 / 10 | 42 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 5 / 10 | 42 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 6 / 10 | 42 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 7 / 10 | 48 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 8 / 10 | 131 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 9 / 10 | 138 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 271 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 1 / 10 | 57 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload | 2 / 10 | 57 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di | 3 / 10 | 57 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di-codegen | 4 / 10 | 57 B |
| Deno | complete | `warmResolveTransientFactory` | inversify-jit | 5 / 10 | 58 B |
| Deno | complete | `warmResolveTransientFactory` | inversify | 6 / 10 | 58 B |
| Deno | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 65 B |
| Deno | complete | `warmResolveTransientFactory` | typed-inject | 8 / 10 | 147 B |
| Deno | complete | `warmResolveTransientFactory` | awilix | 9 / 10 | 154 B |
| Deno | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 276 B |
| Deno | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 68 B |
| Deno | complete | `coldResolveTransientFactory` | scope-di | 2 / 8 | 71 B |
| Deno | complete | `coldResolveTransientFactory` | typed-inject | 3 / 8 | 148 B |
| Deno | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 308 B |
| Deno | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 350 B |
| Deno | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 367 B |
| Deno | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 6.64 KB |
| Deno | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 10.11 KB |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 1 / 10 | 90 B |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 90 B |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 3 / 10 | 90 B |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di | 4 / 10 | 90 B |
| Deno | complete | `warmResolveTransientFactoryChain` | typedi | 5 / 10 | 100 B |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify-jit | 6 / 10 | 137 B |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify | 7 / 10 | 139 B |
| Deno | complete | `warmResolveTransientFactoryChain` | awilix | 8 / 10 | 381 B |
| Deno | complete | `warmResolveTransientFactoryChain` | typed-inject | 9 / 10 | 609 B |
| Deno | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 758 B |
| Deno | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 125 B |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di | 2 / 8 | 156 B |
| Deno | complete | `coldResolveTransientFactoryChain` | awilix | 3 / 8 | 540 B |
| Deno | complete | `coldResolveTransientFactoryChain` | typed-inject | 4 / 8 | 604 B |
| Deno | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 850 B |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 1.07 KB |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 17.56 KB |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 34.07 KB |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 2 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 3 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 4 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 424 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 486 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 7 / 10 | 783 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 8 / 10 | 1.25 KB |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 2.05 KB |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 2.36 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 222 B |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 2 / 8 | 920 B |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 3 / 8 | 1.22 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 4 / 8 | 2.39 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 5 / 8 | 2.83 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 6 / 8 | 3.01 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 36.44 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 60.57 KB |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 218 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 218 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 3 / 10 | 412 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 4 / 10 | 414 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 455 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 532 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 7 / 10 | 889 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 8 / 10 | 1.47 KB |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 2.43 KB |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 2.82 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 450 B |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 2 / 8 | 1.06 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 3 / 8 | 1.47 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 4 / 8 | 2.84 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 5 / 8 | 3.31 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 6 / 8 | 3.37 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 38.33 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 71.95 KB |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 1 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 2 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 186 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 234 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify | 5 / 10 | 267 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 6 / 10 | 295 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typedi | 7 / 10 | 630 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | awilix | 8 / 10 | 757 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 9 / 10 | 1.19 KB |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 1.63 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 297 B |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 662 B |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | awilix | 3 / 8 | 917 B |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 4 / 8 | 1.19 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 2.53 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 2.59 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 32.07 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 59.08 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 1 / 10 | 352 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 2 / 10 | 352 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 3 / 10 | 564 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 4 / 10 | 576 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 5 / 10 | 579 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 694 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 7 / 10 | 1.40 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 8 / 10 | 2.34 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 3.85 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 4.68 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 567 B |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 2 / 8 | 1.60 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 3 / 8 | 2.35 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 4 / 8 | 4.72 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 5 / 8 | 6.21 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 6 / 8 | 10.23 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 7 / 8 | 58.52 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 98.27 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 978 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 979 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 3 / 10 | 982 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 4 / 10 | 1.01 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 5 / 10 | 2.14 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 6 / 10 | 2.30 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 7 / 10 | 2.52 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 8 / 10 | 3.65 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 9 / 10 | 3.96 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 10 / 10 | 6.58 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 1.08 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 2 / 8 | 3.52 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 3 / 8 | 4.16 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 4 / 8 | 6.60 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 5 / 8 | 8.80 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 6 / 8 | 20.32 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 7 / 8 | 141.81 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 267.46 KB |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 203 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 206 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typedi | 3 / 10 | 211 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 4 / 10 | 313 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 5 / 10 | 314 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify | 6 / 10 | 326 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 7 / 10 | 357 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 8 / 10 | 455 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 759 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 2.49 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 1 / 10 | 383 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 2 / 10 | 385 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 3 / 10 | 385 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 4 / 10 | 385 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 5 / 10 | 407 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 1.54 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 1.58 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 8 / 10 | 1.92 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 9 / 10 | 2.36 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 7.08 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Deno | 2.9.6 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26300 x64 | complete | 300 | [`bench_deno_json_complete.json`](./bench_deno_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [7de000ef198459b0a478103290b40a43dc266e0e](https://github.com/SvS-tm/scope-di/commit/7de000ef198459b0a478103290b40a43dc266e0e) |
| Branch | chore/benchmarks-alien |
