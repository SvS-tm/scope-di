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
| Deno | complete | `registrationClass` | tsyringe | 1 / 9 | 157.40 us | 154.60 us - 310.40 us |
| Deno | complete | `registrationClass` | typed-inject | 2 / 9 | 311.20 us | 304.90 us - 365.00 us |
| Deno | complete | `registrationClass` | needle-di | 3 / 9 | 355.80 us | 350.40 us - 356.30 us |
| Deno | complete | `registrationClass` | scope-di | 4 / 9 | 379.20 us | 372.20 us - 394.70 us |
| Deno | complete | `registrationClass` | scope-di-codegen | 5 / 9 | 380.60 us | 374.90 us - 541.20 us |
| Deno | complete | `registrationClass` | typedi | 6 / 9 | 400.70 us | 392.70 us - 523.80 us |
| Deno | complete | `registrationClass` | awilix | 7 / 9 | 1.50 ms | 1.50 ms - 1.53 ms |
| Deno | complete | `registrationClass` | inversify-jit | 8 / 9 | 2.98 ms | 2.95 ms - 3.08 ms |
| Deno | complete | `registrationClass` | inversify | 9 / 9 | 3.01 ms | 2.94 ms - 3.15 ms |
| Deno | complete | `registrationValue` | tsyringe | 1 / 9 | 22.50 us | 21.80 us - 24.20 us |
| Deno | complete | `registrationValue` | needle-di | 2 / 9 | 139.60 us | 135.60 us - 140.70 us |
| Deno | complete | `registrationValue` | typed-inject | 3 / 9 | 154.30 us | 152.90 us - 155.50 us |
| Deno | complete | `registrationValue` | typedi | 4 / 9 | 190.40 us | 190.10 us - 206.40 us |
| Deno | complete | `registrationValue` | scope-di-codegen | 5 / 9 | 247.60 us | 215.00 us - 261.90 us |
| Deno | complete | `registrationValue` | scope-di | 6 / 9 | 261.30 us | 225.60 us - 264.40 us |
| Deno | complete | `registrationValue` | awilix | 7 / 9 | 457.00 us | 442.20 us - 555.30 us |
| Deno | complete | `registrationValue` | inversify | 8 / 9 | 2.50 ms | 2.48 ms - 2.54 ms |
| Deno | complete | `registrationValue` | inversify-jit | 9 / 9 | 2.52 ms | 2.49 ms - 2.56 ms |
| Deno | complete | `registrationFactory` | tsyringe | 1 / 9 | 25.60 us | 22.80 us - 28.80 us |
| Deno | complete | `registrationFactory` | needle-di | 2 / 9 | 147.80 us | 143.60 us - 173.80 us |
| Deno | complete | `registrationFactory` | typed-inject | 3 / 9 | 164.10 us | 161.90 us - 164.70 us |
| Deno | complete | `registrationFactory` | scope-di-codegen | 4 / 9 | 223.90 us | 223.40 us - 234.80 us |
| Deno | complete | `registrationFactory` | scope-di | 5 / 9 | 227.50 us | 223.90 us - 263.80 us |
| Deno | complete | `registrationFactory` | typedi | 6 / 9 | 258.10 us | 247.20 us - 262.20 us |
| Deno | complete | `registrationFactory` | awilix | 7 / 9 | 594.60 us | 583.70 us - 855.10 us |
| Deno | complete | `registrationFactory` | inversify | 8 / 9 | 2.63 ms | 2.63 ms - 2.74 ms |
| Deno | complete | `registrationFactory` | inversify-jit | 9 / 9 | 2.67 ms | 2.64 ms - 2.70 ms |
| Deno | complete | `warmResolveValue` | typed-inject | 1 / 11 | 1.8 ns | 0.9 ns - 8.5 ns |
| Deno | complete | `warmResolveValue` | typedi | 2 / 11 | 10.6 ns | 10.5 ns - 10.6 ns |
| Deno | complete | `warmResolveValue` | inversify | 3 / 11 | 13.9 ns | 13.8 ns - 17.4 ns |
| Deno | complete | `warmResolveValue` | inversify-jit | 4 / 11 | 13.9 ns | 13.8 ns - 13.9 ns |
| Deno | complete | `warmResolveValue` | awilix | 5 / 11 | 15.4 ns | 15.4 ns - 15.5 ns |
| Deno | complete | `warmResolveValue` | scope-di-module-reload | 6 / 11 | 18.7 ns | 18.6 ns - 21.3 ns |
| Deno | complete | `warmResolveValue` | scope-di-codegen | 7 / 11 | 18.8 ns | 18.7 ns - 21.9 ns |
| Deno | complete | `warmResolveValue` | scope-di-module-reload-codegen | 8 / 11 | 18.9 ns | 18.7 ns - 23.1 ns |
| Deno | complete | `warmResolveValue` | scope-di | 9 / 11 | 21.3 ns | 18.6 ns - 22.7 ns |
| Deno | complete | `warmResolveValue` | needle-di | 10 / 11 | 22.3 ns | 22.3 ns - 27.8 ns |
| Deno | complete | `warmResolveValue` | tsyringe | 11 / 11 | 179.0 ns | 109.9 ns - 180.4 ns |
| Deno | complete | `coldResolveValue` | typed-inject | 1 / 9 | 9.5 ns | 9.2 ns - 11.1 ns |
| Deno | complete | `coldResolveValue` | typedi | 2 / 9 | 26.2 ns | 24.0 ns - 26.3 ns |
| Deno | complete | `coldResolveValue` | scope-di | 3 / 9 | 129.1 ns | 114.3 ns - 138.3 ns |
| Deno | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 129.8 ns | 119.2 ns - 141.8 ns |
| Deno | complete | `coldResolveValue` | awilix | 5 / 9 | 296.0 ns | 282.5 ns - 327.7 ns |
| Deno | complete | `coldResolveValue` | tsyringe | 6 / 9 | 338.2 ns | 328.8 ns - 360.0 ns |
| Deno | complete | `coldResolveValue` | needle-di | 7 / 9 | 826.8 ns | 814.8 ns - 839.6 ns |
| Deno | complete | `coldResolveValue` | inversify-jit | 8 / 9 | 40.20 us | 38.70 us - 46.20 us |
| Deno | complete | `coldResolveValue` | inversify | 9 / 9 | 41.40 us | 39.00 us - 43.70 us |
| Deno | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 8.0 ns | 1.0 ns - 8.3 ns |
| Deno | complete | `warmResolveSingletonClass` | typedi | 2 / 11 | 10.6 ns | 10.6 ns - 10.6 ns |
| Deno | complete | `warmResolveSingletonClass` | inversify | 3 / 11 | 13.2 ns | 13.1 ns - 13.2 ns |
| Deno | complete | `warmResolveSingletonClass` | inversify-jit | 4 / 11 | 13.2 ns | 13.1 ns - 16.4 ns |
| Deno | complete | `warmResolveSingletonClass` | awilix | 5 / 11 | 13.3 ns | 13.3 ns - 13.4 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 6 / 11 | 18.7 ns | 18.6 ns - 23.7 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di-codegen | 7 / 11 | 18.8 ns | 18.6 ns - 23.3 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di | 8 / 11 | 18.8 ns | 18.8 ns - 31.1 ns |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload | 9 / 11 | 21.5 ns | 18.7 ns - 23.3 ns |
| Deno | complete | `warmResolveSingletonClass` | needle-di | 10 / 11 | 26.1 ns | 22.3 ns - 27.9 ns |
| Deno | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 182.0 ns | 164.1 ns - 183.6 ns |
| Deno | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 92.5 ns | 86.8 ns - 96.5 ns |
| Deno | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 167.1 ns | 146.0 ns - 178.4 ns |
| Deno | complete | `coldResolveSingletonClass` | scope-di | 3 / 9 | 170.9 ns | 160.4 ns - 202.4 ns |
| Deno | complete | `coldResolveSingletonClass` | typedi | 4 / 9 | 293.2 ns | 273.3 ns - 302.7 ns |
| Deno | complete | `coldResolveSingletonClass` | tsyringe | 5 / 9 | 453.1 ns | 408.1 ns - 470.0 ns |
| Deno | complete | `coldResolveSingletonClass` | awilix | 6 / 9 | 503.1 ns | 499.7 ns - 514.2 ns |
| Deno | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 854.4 ns | 828.8 ns - 978.7 ns |
| Deno | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 53.00 us | 52.20 us - 55.70 us |
| Deno | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 54.60 us | 49.30 us - 55.40 us |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload | 1 / 10 | 13.3 ns | 13.3 ns - 13.9 ns |
| Deno | complete | `warmResolveTransientClass` | scope-di-codegen | 2 / 10 | 13.3 ns | 13.3 ns - 13.4 ns |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 3 / 10 | 13.4 ns | 13.3 ns - 13.5 ns |
| Deno | complete | `warmResolveTransientClass` | scope-di | 4 / 10 | 13.4 ns | 13.4 ns - 16.6 ns |
| Deno | complete | `warmResolveTransientClass` | inversify-jit | 5 / 10 | 15.9 ns | 15.8 ns - 15.9 ns |
| Deno | complete | `warmResolveTransientClass` | inversify | 6 / 10 | 16.4 ns | 16.4 ns - 16.6 ns |
| Deno | complete | `warmResolveTransientClass` | awilix | 7 / 10 | 22.0 ns | 21.4 ns - 28.0 ns |
| Deno | complete | `warmResolveTransientClass` | typed-inject | 8 / 10 | 25.7 ns | 24.5 ns - 30.7 ns |
| Deno | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 200.8 ns | 198.5 ns - 216.5 ns |
| Deno | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 237.0 ns | 232.0 ns - 240.0 ns |
| Deno | complete | `coldResolveTransientClass` | typed-inject | 1 / 8 | 33.5 ns | 33.0 ns - 35.1 ns |
| Deno | complete | `coldResolveTransientClass` | scope-di | 2 / 8 | 57.3 ns | 55.8 ns - 68.1 ns |
| Deno | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 257.2 ns | 233.3 ns - 265.2 ns |
| Deno | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 396.1 ns | 388.2 ns - 410.3 ns |
| Deno | complete | `coldResolveTransientClass` | awilix | 5 / 8 | 421.9 ns | 416.5 ns - 436.4 ns |
| Deno | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 11.08 us | 11.00 us - 11.12 us |
| Deno | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 52.40 us | 49.10 us - 55.70 us |
| Deno | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 125.10 us | 118.40 us - 133.30 us |
| Deno | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 1.5 ns | 0.9 ns - 8.2 ns |
| Deno | complete | `warmResolveSingletonFactory` | typedi | 2 / 11 | 10.6 ns | 10.6 ns - 10.6 ns |
| Deno | complete | `warmResolveSingletonFactory` | inversify-jit | 3 / 11 | 13.1 ns | 13.1 ns - 14.6 ns |
| Deno | complete | `warmResolveSingletonFactory` | inversify | 4 / 11 | 13.2 ns | 13.1 ns - 15.7 ns |
| Deno | complete | `warmResolveSingletonFactory` | awilix | 5 / 11 | 13.3 ns | 13.2 ns - 13.4 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 6 / 11 | 18.7 ns | 18.7 ns - 21.5 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 7 / 11 | 18.8 ns | 18.6 ns - 21.5 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-codegen | 8 / 11 | 18.8 ns | 18.6 ns - 23.2 ns |
| Deno | complete | `warmResolveSingletonFactory` | scope-di | 9 / 11 | 21.6 ns | 18.7 ns - 23.3 ns |
| Deno | complete | `warmResolveSingletonFactory` | needle-di | 10 / 11 | 22.3 ns | 22.2 ns - 22.4 ns |
| Deno | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 174.0 ns | 102.2 ns - 178.2 ns |
| Deno | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 34.8 ns | 34.6 ns - 35.5 ns |
| Deno | complete | `coldResolveSingletonFactory` | typed-inject | 2 / 9 | 81.9 ns | 78.6 ns - 83.2 ns |
| Deno | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 151.0 ns | 128.9 ns - 164.7 ns |
| Deno | complete | `coldResolveSingletonFactory` | scope-di | 4 / 9 | 151.4 ns | 146.0 ns - 173.5 ns |
| Deno | complete | `coldResolveSingletonFactory` | tsyringe | 5 / 9 | 391.7 ns | 340.3 ns - 404.6 ns |
| Deno | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 476.4 ns | 461.0 ns - 486.7 ns |
| Deno | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 865.6 ns | 851.0 ns - 990.6 ns |
| Deno | complete | `coldResolveSingletonFactory` | inversify-jit | 8 / 9 | 47.90 us | 42.40 us - 51.80 us |
| Deno | complete | `coldResolveSingletonFactory` | inversify | 9 / 9 | 51.40 us | 46.80 us - 51.90 us |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 1 / 10 | 23.6 ns | 20.9 ns - 24.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 2 / 10 | 24.0 ns | 23.8 ns - 26.0 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 3 / 10 | 24.3 ns | 24.2 ns - 25.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 4 / 10 | 27.8 ns | 25.0 ns - 32.4 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 5 / 10 | 34.4 ns | 32.9 ns - 36.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 6 / 10 | 37.6 ns | 34.8 ns - 39.7 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 7 / 10 | 38.7 ns | 33.3 ns - 46.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 8 / 10 | 39.0 ns | 36.7 ns - 52.5 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 9 / 10 | 39.9 ns | 33.9 ns - 48.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 193.9 ns | 118.0 ns - 204.3 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload | 1 / 10 | 13.5 ns | 13.5 ns - 13.7 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di | 2 / 10 | 13.5 ns | 13.5 ns - 16.8 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 3 / 10 | 13.6 ns | 13.5 ns - 16.8 ns |
| Deno | complete | `warmResolveTransientFactory` | scope-di-codegen | 4 / 10 | 13.6 ns | 13.5 ns - 13.9 ns |
| Deno | complete | `warmResolveTransientFactory` | inversify | 5 / 10 | 16.4 ns | 16.3 ns - 23.1 ns |
| Deno | complete | `warmResolveTransientFactory` | inversify-jit | 6 / 10 | 16.9 ns | 16.4 ns - 20.5 ns |
| Deno | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 19.8 ns | 19.7 ns - 20.2 ns |
| Deno | complete | `warmResolveTransientFactory` | awilix | 8 / 10 | 22.5 ns | 22.5 ns - 24.6 ns |
| Deno | complete | `warmResolveTransientFactory` | typed-inject | 9 / 10 | 26.3 ns | 24.2 ns - 33.5 ns |
| Deno | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 188.8 ns | 178.7 ns - 193.2 ns |
| Deno | complete | `coldResolveTransientFactory` | typed-inject | 1 / 8 | 28.9 ns | 26.5 ns - 32.4 ns |
| Deno | complete | `coldResolveTransientFactory` | typedi | 2 / 8 | 30.7 ns | 29.3 ns - 34.7 ns |
| Deno | complete | `coldResolveTransientFactory` | scope-di | 3 / 8 | 71.2 ns | 61.6 ns - 75.6 ns |
| Deno | complete | `coldResolveTransientFactory` | tsyringe | 4 / 8 | 344.4 ns | 307.6 ns - 380.2 ns |
| Deno | complete | `coldResolveTransientFactory` | awilix | 5 / 8 | 379.2 ns | 374.0 ns - 401.4 ns |
| Deno | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 11.03 us | 10.95 us - 11.16 us |
| Deno | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 47.70 us | 43.10 us - 49.60 us |
| Deno | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 130.20 us | 126.10 us - 141.20 us |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 1 / 10 | 30.0 ns | 29.9 ns - 30.2 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 30.5 ns | 30.1 ns - 54.6 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 3 / 10 | 33.1 ns | 32.8 ns - 35.1 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify-jit | 4 / 10 | 44.7 ns | 42.6 ns - 53.6 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di | 5 / 10 | 52.7 ns | 48.6 ns - 59.0 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify | 6 / 10 | 56.6 ns | 55.3 ns - 60.9 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | typedi | 7 / 10 | 91.4 ns | 75.9 ns - 125.3 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | typed-inject | 8 / 10 | 120.5 ns | 109.4 ns - 136.4 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | awilix | 9 / 10 | 158.4 ns | 153.7 ns - 164.2 ns |
| Deno | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 381.7 ns | 340.5 ns - 465.6 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 94.6 ns | 88.5 ns - 120.7 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | typed-inject | 2 / 8 | 166.2 ns | 162.9 ns - 197.3 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di | 3 / 8 | 482.2 ns | 472.8 ns - 518.1 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | awilix | 4 / 8 | 946.6 ns | 898.9 ns - 965.0 ns |
| Deno | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 1.07 us | 940.4 ns - 1.11 us |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 37.24 us | 36.85 us - 37.65 us |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 63.60 us | 63.00 us - 65.30 us |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 231.30 us | 226.30 us - 239.10 us |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 56.3 ns | 52.6 ns - 57.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 2 / 10 | 61.6 ns | 57.6 ns - 82.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 3 / 10 | 66.2 ns | 58.9 ns - 86.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 4 / 10 | 68.2 ns | 52.6 ns - 75.3 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 124.4 ns | 117.3 ns - 144.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 151.2 ns | 142.3 ns - 167.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 7 / 10 | 297.7 ns | 290.0 ns - 316.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 8 / 10 | 402.5 ns | 380.8 ns - 482.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 1.05 us | 858.0 ns - 1.16 us |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 1.20 us | 1.18 us - 1.21 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 1 / 8 | 496.5 ns | 449.4 ns - 540.8 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 2 / 8 | 527.2 ns | 484.8 ns - 552.8 ns |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 3 / 8 | 1.92 us | 1.85 us - 1.94 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 4 / 8 | 2.62 us | 2.24 us - 2.77 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 5 / 8 | 11.20 us | 1.22 us - 13.90 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 6 / 8 | 84.40 us | 82.80 us - 85.70 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 7 / 8 | 131.60 us | 128.90 us - 141.10 us |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 342.70 us | 335.80 us - 350.80 us |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 70.5 ns | 69.3 ns - 95.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 78.8 ns | 66.9 ns - 84.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 3 / 10 | 123.8 ns | 112.6 ns - 133.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 126.2 ns | 114.2 ns - 130.3 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 135.1 ns | 132.8 ns - 144.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 175.7 ns | 164.6 ns - 214.0 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 7 / 10 | 352.5 ns | 339.4 ns - 356.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 497.5 ns | 473.3 ns - 500.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 1.16 us | 1.12 us - 1.21 us |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 1.42 us | 1.38 us - 1.45 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 1 / 8 | 570.0 ns | 544.4 ns - 594.0 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 2 / 8 | 777.8 ns | 752.6 ns - 790.1 ns |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 3 / 8 | 1.48 us | 1.45 us - 1.59 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 4 / 8 | 2.19 us | 2.13 us - 2.31 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 2.79 us | 2.44 us - 2.98 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 6 / 8 | 85.90 us | 80.70 us - 88.00 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 7 / 8 | 144.20 us | 141.90 us - 154.50 us |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 368.00 us | 365.40 us - 378.70 us |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 1 / 10 | 49.9 ns | 49.1 ns - 56.7 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 2 / 10 | 50.5 ns | 49.0 ns - 54.2 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 57.5 ns | 54.7 ns - 62.2 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 120.9 ns | 108.5 ns - 145.7 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify | 5 / 10 | 161.9 ns | 152.7 ns - 170.5 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 6 / 10 | 219.7 ns | 214.5 ns - 225.1 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | awilix | 7 / 10 | 337.3 ns | 336.2 ns - 360.4 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 8 / 10 | 349.2 ns | 339.1 ns - 356.6 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typedi | 9 / 10 | 398.0 ns | 394.0 ns - 411.9 ns |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 1.02 us | 987.0 ns - 1.09 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typedi | 1 / 8 | 466.8 ns | 442.8 ns - 11.70 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 2 / 8 | 560.4 ns | 535.3 ns - 639.7 ns |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 3 / 8 | 947.9 ns | 938.6 ns - 1.03 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | awilix | 4 / 8 | 1.88 us | 1.86 us - 1.94 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 2.23 us | 2.02 us - 2.27 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify | 6 / 8 | 84.10 us | 81.30 us - 89.00 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 7 / 8 | 132.40 us | 129.00 us - 134.10 us |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 359.50 us | 353.60 us - 374.30 us |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 1 / 10 | 129.3 ns | 120.8 ns - 155.0 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 2 / 10 | 131.2 ns | 114.9 ns - 143.6 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 3 / 10 | 177.3 ns | 173.2 ns - 199.1 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 4 / 10 | 178.2 ns | 165.4 ns - 182.0 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 5 / 10 | 182.5 ns | 177.9 ns - 190.8 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 219.4 ns | 207.1 ns - 232.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 7 / 10 | 557.3 ns | 538.6 ns - 623.2 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 8 / 10 | 796.1 ns | 734.4 ns - 845.9 ns |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 1.47 us | 1.21 us - 1.68 us |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 2.42 us | 2.36 us - 2.65 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 685.9 ns | 659.0 ns - 698.3 ns |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 2 / 8 | 1.16 us | 1.13 us - 1.16 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 3 / 8 | 2.44 us | 2.37 us - 15.40 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 4 / 8 | 3.51 us | 3.43 us - 3.83 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 5 / 8 | 3.95 us | 3.59 us - 25.80 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 6 / 8 | 94.00 us | 93.70 us - 94.90 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 7 / 8 | 201.40 us | 194.50 us - 215.80 us |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 470.90 us | 468.40 us - 476.00 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 359.5 ns | 357.0 ns - 368.2 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 2 / 10 | 364.8 ns | 357.1 ns - 459.1 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 409.3 ns | 400.4 ns - 421.3 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 4 / 10 | 917.9 ns | 843.4 ns - 987.7 ns |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 5 / 10 | 930.2 ns | 836.8 ns - 1.02 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 1.04 us | 1.00 us - 1.05 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 7 / 10 | 2.03 us | 2.02 us - 2.11 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 8 / 10 | 2.41 us | 2.30 us - 2.70 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 9 / 10 | 3.70 us | 3.67 us - 4.11 us |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 27.70 us | 7.89 us - 30.60 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 3.19 us | 3.08 us - 3.39 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 2 / 8 | 5.28 us | 5.27 us - 5.50 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 3 / 8 | 12.13 us | 12.02 us - 12.39 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 4 / 8 | 28.50 us | 27.70 us - 29.60 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 5 / 8 | 36.00 us | 35.50 us - 37.80 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 6 / 8 | 152.40 us | 145.20 us - 154.30 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 7 / 8 | 446.30 us | 442.80 us - 449.70 us |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 1.08 ms | 1.07 ms - 1.09 ms |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify | 1 / 10 | 177.1 ns | 169.5 ns - 206.2 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 184.3 ns | 175.9 ns - 206.8 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typedi | 3 / 10 | 184.5 ns | 183.3 ns - 201.1 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 4 / 10 | 188.4 ns | 186.2 ns - 211.3 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 5 / 10 | 211.2 ns | 204.9 ns - 221.8 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 6 / 10 | 223.2 ns | 210.8 ns - 227.6 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 7 / 10 | 223.3 ns | 209.3 ns - 287.3 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 8 / 10 | 238.7 ns | 234.6 ns - 288.6 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 484.4 ns | 465.9 ns - 508.9 ns |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 1.06 us | 977.7 ns - 1.17 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 507.0 ns | 478.1 ns - 539.1 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 519.3 ns | 496.2 ns - 556.0 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 591.8 ns | 583.3 ns - 614.4 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 4 / 10 | 709.7 ns | 670.9 ns - 723.3 ns |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 5 / 10 | 910.4 ns | 875.4 ns - 1.05 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 1.09 us | 1.07 us - 1.12 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 1.35 us | 1.31 us - 1.36 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 8 / 10 | 1.39 us | 1.37 us - 1.42 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 9 / 10 | 2.38 us | 2.34 us - 2.49 us |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 3.09 us | 3.05 us - 3.16 us |

## Memory Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Allocations |
| --- | --- | --- | --- | ---: | ---: |
| Deno | complete | `registrationClass` | typedi | 1 / 9 | 245.71 KB |
| Deno | complete | `registrationClass` | typed-inject | 2 / 9 | 277.89 KB |
| Deno | complete | `registrationClass` | tsyringe | 3 / 9 | 280.04 KB |
| Deno | complete | `registrationClass` | needle-di | 4 / 9 | 369.46 KB |
| Deno | complete | `registrationClass` | scope-di | 5 / 9 | 554.88 KB |
| Deno | complete | `registrationClass` | scope-di-codegen | 6 / 9 | 556.29 KB |
| Deno | complete | `registrationClass` | awilix | 7 / 9 | 1.35 MB |
| Deno | complete | `registrationClass` | inversify | 8 / 9 | 3.53 MB |
| Deno | complete | `registrationClass` | inversify-jit | 9 / 9 | 3.53 MB |
| Deno | complete | `registrationValue` | typedi | 1 / 9 | 116.93 KB |
| Deno | complete | `registrationValue` | tsyringe | 2 / 9 | 135.13 KB |
| Deno | complete | `registrationValue` | needle-di | 3 / 9 | 135.70 KB |
| Deno | complete | `registrationValue` | typed-inject | 4 / 9 | 140.09 KB |
| Deno | complete | `registrationValue` | awilix | 5 / 9 | 299.87 KB |
| Deno | complete | `registrationValue` | scope-di | 6 / 9 | 409.18 KB |
| Deno | complete | `registrationValue` | scope-di-codegen | 7 / 9 | 409.28 KB |
| Deno | complete | `registrationValue` | inversify | 8 / 9 | 3.12 MB |
| Deno | complete | `registrationValue` | inversify-jit | 9 / 9 | 3.12 MB |
| Deno | complete | `registrationFactory` | typedi | 1 / 9 | 105.23 KB |
| Deno | complete | `registrationFactory` | needle-di | 2 / 9 | 130.63 KB |
| Deno | complete | `registrationFactory` | typed-inject | 3 / 9 | 139.99 KB |
| Deno | complete | `registrationFactory` | tsyringe | 4 / 9 | 166.95 KB |
| Deno | complete | `registrationFactory` | scope-di-codegen | 5 / 9 | 369.88 KB |
| Deno | complete | `registrationFactory` | scope-di | 6 / 9 | 398.62 KB |
| Deno | complete | `registrationFactory` | awilix | 7 / 9 | 1.08 MB |
| Deno | complete | `registrationFactory` | inversify | 8 / 9 | 3.20 MB |
| Deno | complete | `registrationFactory` | inversify-jit | 9 / 9 | 3.21 MB |
| Deno | complete | `warmResolveValue` | typed-inject | 1 / 11 | 3 B |
| Deno | complete | `warmResolveValue` | scope-di-module-reload | 2 / 11 | 3 B |
| Deno | complete | `warmResolveValue` | scope-di-module-reload-codegen | 3 / 11 | 3 B |
| Deno | complete | `warmResolveValue` | scope-di | 4 / 11 | 3 B |
| Deno | complete | `warmResolveValue` | scope-di-codegen | 5 / 11 | 4 B |
| Deno | complete | `warmResolveValue` | needle-di | 6 / 11 | 6 B |
| Deno | complete | `warmResolveValue` | typedi | 7 / 11 | 12 B |
| Deno | complete | `warmResolveValue` | inversify-jit | 8 / 11 | 50 B |
| Deno | complete | `warmResolveValue` | inversify | 9 / 11 | 50 B |
| Deno | complete | `warmResolveValue` | awilix | 10 / 11 | 100 B |
| Deno | complete | `warmResolveValue` | tsyringe | 11 / 11 | 271 B |
| Deno | complete | `coldResolveValue` | typed-inject | 1 / 9 | 2 B |
| Deno | complete | `coldResolveValue` | typedi | 2 / 9 | 14 B |
| Deno | complete | `coldResolveValue` | scope-di | 3 / 9 | 76 B |
| Deno | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 80 B |
| Deno | complete | `coldResolveValue` | tsyringe | 5 / 9 | 248 B |
| Deno | complete | `coldResolveValue` | awilix | 6 / 9 | 250 B |
| Deno | complete | `coldResolveValue` | needle-di | 7 / 9 | 508 B |
| Deno | complete | `coldResolveValue` | inversify-jit | 8 / 9 | 6.09 KB |
| Deno | complete | `coldResolveValue` | inversify | 9 / 9 | 7.04 KB |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 1 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di-module-reload | 2 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | inversify-jit | 3 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | inversify | 4 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | typed-inject | 5 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di | 6 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonClass` | scope-di-codegen | 7 / 11 | 4 B |
| Deno | complete | `warmResolveSingletonClass` | needle-di | 8 / 11 | 6 B |
| Deno | complete | `warmResolveSingletonClass` | typedi | 9 / 11 | 11 B |
| Deno | complete | `warmResolveSingletonClass` | awilix | 10 / 11 | 60 B |
| Deno | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 271 B |
| Deno | complete | `coldResolveSingletonClass` | scope-di-codegen | 1 / 9 | 98 B |
| Deno | complete | `coldResolveSingletonClass` | scope-di | 2 / 9 | 99 B |
| Deno | complete | `coldResolveSingletonClass` | typed-inject | 3 / 9 | 154 B |
| Deno | complete | `coldResolveSingletonClass` | awilix | 4 / 9 | 329 B |
| Deno | complete | `coldResolveSingletonClass` | typedi | 5 / 9 | 365 B |
| Deno | complete | `coldResolveSingletonClass` | tsyringe | 6 / 9 | 450 B |
| Deno | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 623 B |
| Deno | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 8.71 KB |
| Deno | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 9.47 KB |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload | 1 / 10 | 26 B |
| Deno | complete | `warmResolveTransientClass` | scope-di-codegen | 2 / 10 | 26 B |
| Deno | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 3 / 10 | 27 B |
| Deno | complete | `warmResolveTransientClass` | scope-di | 4 / 10 | 27 B |
| Deno | complete | `warmResolveTransientClass` | inversify | 5 / 10 | 27 B |
| Deno | complete | `warmResolveTransientClass` | inversify-jit | 6 / 10 | 28 B |
| Deno | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 123 B |
| Deno | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 125 B |
| Deno | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 363 B |
| Deno | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 478 B |
| Deno | complete | `coldResolveTransientClass` | scope-di | 1 / 8 | 56 B |
| Deno | complete | `coldResolveTransientClass` | typed-inject | 2 / 8 | 118 B |
| Deno | complete | `coldResolveTransientClass` | awilix | 3 / 8 | 294 B |
| Deno | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 360 B |
| Deno | complete | `coldResolveTransientClass` | typedi | 5 / 8 | 389 B |
| Deno | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 476 B |
| Deno | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 9.44 KB |
| Deno | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 12.43 KB |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 1 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonFactory` | typed-inject | 2 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di | 3 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 4 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonFactory` | inversify | 5 / 11 | 3 B |
| Deno | complete | `warmResolveSingletonFactory` | scope-di-codegen | 6 / 11 | 4 B |
| Deno | complete | `warmResolveSingletonFactory` | inversify-jit | 7 / 11 | 4 B |
| Deno | complete | `warmResolveSingletonFactory` | needle-di | 8 / 11 | 7 B |
| Deno | complete | `warmResolveSingletonFactory` | typedi | 9 / 11 | 12 B |
| Deno | complete | `warmResolveSingletonFactory` | awilix | 10 / 11 | 60 B |
| Deno | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 266 B |
| Deno | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 15 B |
| Deno | complete | `coldResolveSingletonFactory` | scope-di-codegen | 2 / 9 | 82 B |
| Deno | complete | `coldResolveSingletonFactory` | scope-di | 3 / 9 | 85 B |
| Deno | complete | `coldResolveSingletonFactory` | typed-inject | 4 / 9 | 127 B |
| Deno | complete | `coldResolveSingletonFactory` | tsyringe | 5 / 9 | 274 B |
| Deno | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 313 B |
| Deno | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 490 B |
| Deno | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 7.88 KB |
| Deno | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 8.11 KB |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 1 / 10 | 44 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 2 / 10 | 45 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 3 / 10 | 46 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 4 / 10 | 46 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 5 / 10 | 47 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 6 / 10 | 54 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 7 / 10 | 54 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 8 / 10 | 137 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 9 / 10 | 139 B |
| Deno | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 283 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload | 1 / 10 | 58 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di-codegen | 2 / 10 | 59 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 3 / 10 | 59 B |
| Deno | complete | `warmResolveTransientFactory` | scope-di | 4 / 10 | 59 B |
| Deno | complete | `warmResolveTransientFactory` | inversify | 5 / 10 | 59 B |
| Deno | complete | `warmResolveTransientFactory` | inversify-jit | 6 / 10 | 60 B |
| Deno | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 69 B |
| Deno | complete | `warmResolveTransientFactory` | typed-inject | 8 / 10 | 155 B |
| Deno | complete | `warmResolveTransientFactory` | awilix | 9 / 10 | 157 B |
| Deno | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 284 B |
| Deno | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 71 B |
| Deno | complete | `coldResolveTransientFactory` | scope-di | 2 / 8 | 90 B |
| Deno | complete | `coldResolveTransientFactory` | typed-inject | 3 / 8 | 149 B |
| Deno | complete | `coldResolveTransientFactory` | tsyringe | 4 / 8 | 221 B |
| Deno | complete | `coldResolveTransientFactory` | awilix | 5 / 8 | 326 B |
| Deno | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 508 B |
| Deno | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 7.83 KB |
| Deno | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 10.48 KB |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 1 / 10 | 91 B |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 92 B |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 3 / 10 | 93 B |
| Deno | complete | `warmResolveTransientFactoryChain` | scope-di | 4 / 10 | 111 B |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify | 5 / 10 | 146 B |
| Deno | complete | `warmResolveTransientFactoryChain` | inversify-jit | 6 / 10 | 150 B |
| Deno | complete | `warmResolveTransientFactoryChain` | typedi | 7 / 10 | 179 B |
| Deno | complete | `warmResolveTransientFactoryChain` | awilix | 8 / 10 | 368 B |
| Deno | complete | `warmResolveTransientFactoryChain` | typed-inject | 9 / 10 | 598 B |
| Deno | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 758 B |
| Deno | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 136 B |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di | 2 / 8 | 195 B |
| Deno | complete | `coldResolveTransientFactoryChain` | awilix | 3 / 8 | 556 B |
| Deno | complete | `coldResolveTransientFactoryChain` | typed-inject | 4 / 8 | 605 B |
| Deno | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 953 B |
| Deno | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 1.09 KB |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 23.18 KB |
| Deno | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 42.91 KB |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 189 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 2 / 10 | 193 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 3 / 10 | 196 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 4 / 10 | 199 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 396 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 459 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 7 / 10 | 758 B |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 8 / 10 | 1.29 KB |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 2.06 KB |
| Deno | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 2.36 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 309 B |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 2 / 8 | 963 B |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 3 / 8 | 1.28 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 4 / 8 | 2.96 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 5 / 8 | 5.63 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 6 / 8 | 8.51 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 50.58 KB |
| Deno | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 73.99 KB |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 231 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 244 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 3 / 10 | 387 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 391 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 434 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 511 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 7 / 10 | 886 B |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 8 / 10 | 1.48 KB |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 2.44 KB |
| Deno | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 2.83 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 454 B |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 2 / 8 | 1.08 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 3 / 8 | 1.50 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 4 / 8 | 2.78 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 3.39 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 6 / 8 | 7.98 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 50.95 KB |
| Deno | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 85.55 KB |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 1 / 10 | 190 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 2 / 10 | 192 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 193 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 4 / 10 | 204 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 5 / 10 | 322 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | inversify | 6 / 10 | 347 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typedi | 7 / 10 | 631 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | awilix | 8 / 10 | 758 B |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 9 / 10 | 1.20 KB |
| Deno | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 1.62 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 343 B |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 630 B |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | awilix | 3 / 8 | 950 B |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 4 / 8 | 1.20 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 2.53 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 7.45 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 43.88 KB |
| Deno | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 70.78 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 1 / 10 | 327 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 2 / 10 | 337 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 3 / 10 | 560 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 4 / 10 | 564 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 5 / 10 | 570 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 728 B |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 7 / 10 | 1.40 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 8 / 10 | 2.34 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 3.86 KB |
| Deno | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 4.69 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 633 B |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 2 / 8 | 1.38 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 3 / 8 | 2.33 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 4 / 8 | 4.71 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 5 / 8 | 6.16 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 6 / 8 | 11.11 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 7 / 8 | 71.45 KB |
| Deno | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 119.27 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 983 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 2 / 10 | 983 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 3 / 10 | 983 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 4 / 10 | 983 B |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 5 / 10 | 2.14 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 6 / 10 | 2.31 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 7 / 10 | 2.53 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 8 / 10 | 3.97 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 9 / 10 | 6.58 KB |
| Deno | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 21.42 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 1.00 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 2 / 8 | 4.23 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 3 / 8 | 6.42 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 4 / 8 | 19.42 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 5 / 8 | 21.67 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 6 / 8 | 22.67 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 7 / 8 | 165.04 KB |
| Deno | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 296.83 KB |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 1 / 10 | 223 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 225 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typedi | 3 / 10 | 227 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 4 / 10 | 328 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 5 / 10 | 331 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify | 6 / 10 | 332 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 7 / 10 | 470 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 8 / 10 | 475 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 760 B |
| Deno | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 2.48 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 1 / 10 | 385 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 387 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 387 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 4 / 10 | 387 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 5 / 10 | 419 B |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 1.54 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 1.58 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 8 / 10 | 1.93 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 9 / 10 | 2.37 KB |
| Deno | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 7.08 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Registrations per batch | Result file |
| --- | --- | --- | --- | ---: | --- |
| Deno | 2.9.6 | Boni / AMD Ryzen 7 3800X 8-Core Processor / win32 10.0.22631 x64 | complete | 300 | [`bench_deno_json_complete.json`](./bench_deno_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | 7de000ef198459b0a478103290b40a43dc266e0e |
| Branch | chore/benchmarks |
