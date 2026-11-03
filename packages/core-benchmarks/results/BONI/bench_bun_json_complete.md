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
| Bun | complete | `registrationClass` | typed-inject | 1 / 9 | 61.60 us | 59.70 us - 64.10 us |
| Bun | complete | `registrationClass` | tsyringe | 2 / 9 | 73.00 us | 71.50 us - 82.20 us |
| Bun | complete | `registrationClass` | needle-di | 3 / 9 | 99.30 us | 96.70 us - 109.00 us |
| Bun | complete | `registrationClass` | scope-di | 4 / 9 | 122.10 us | 117.40 us - 136.90 us |
| Bun | complete | `registrationClass` | scope-di-codegen | 5 / 9 | 124.50 us | 120.90 us - 126.20 us |
| Bun | complete | `registrationClass` | typedi | 6 / 9 | 240.30 us | 238.70 us - 276.50 us |
| Bun | complete | `registrationClass` | inversify | 7 / 9 | 405.30 us | 382.30 us - 461.30 us |
| Bun | complete | `registrationClass` | inversify-jit | 8 / 9 | 445.60 us | 401.90 us - 477.50 us |
| Bun | complete | `registrationClass` | awilix | 9 / 9 | 581.20 us | 567.50 us - 603.50 us |
| Bun | complete | `registrationValue` | typed-inject | 1 / 9 | 26.00 us | 24.40 us - 26.90 us |
| Bun | complete | `registrationValue` | needle-di | 2 / 9 | 33.40 us | 33.20 us - 36.40 us |
| Bun | complete | `registrationValue` | tsyringe | 3 / 9 | 36.70 us | 35.50 us - 37.80 us |
| Bun | complete | `registrationValue` | scope-di | 4 / 9 | 96.40 us | 92.10 us - 105.90 us |
| Bun | complete | `registrationValue` | scope-di-codegen | 5 / 9 | 96.70 us | 94.50 us - 104.00 us |
| Bun | complete | `registrationValue` | typedi | 6 / 9 | 207.50 us | 205.10 us - 247.30 us |
| Bun | complete | `registrationValue` | awilix | 7 / 9 | 219.70 us | 218.10 us - 251.70 us |
| Bun | complete | `registrationValue` | inversify-jit | 8 / 9 | 281.10 us | 276.60 us - 310.40 us |
| Bun | complete | `registrationValue` | inversify | 9 / 9 | 288.30 us | 276.70 us - 310.80 us |
| Bun | complete | `registrationFactory` | typed-inject | 1 / 9 | 29.80 us | 28.90 us - 31.60 us |
| Bun | complete | `registrationFactory` | needle-di | 2 / 9 | 35.00 us | 34.50 us - 39.60 us |
| Bun | complete | `registrationFactory` | tsyringe | 3 / 9 | 49.20 us | 47.00 us - 53.90 us |
| Bun | complete | `registrationFactory` | scope-di-codegen | 4 / 9 | 94.50 us | 92.90 us - 102.90 us |
| Bun | complete | `registrationFactory` | scope-di | 5 / 9 | 103.30 us | 92.80 us - 107.80 us |
| Bun | complete | `registrationFactory` | typedi | 6 / 9 | 202.80 us | 200.60 us - 232.50 us |
| Bun | complete | `registrationFactory` | inversify-jit | 7 / 9 | 296.40 us | 289.80 us - 310.60 us |
| Bun | complete | `registrationFactory` | inversify | 8 / 9 | 297.90 us | 290.00 us - 333.80 us |
| Bun | complete | `registrationFactory` | awilix | 9 / 9 | 447.40 us | 445.40 us - 526.70 us |
| Bun | complete | `warmResolveValue` | typed-inject | 1 / 11 | 7.4 ns | 7.4 ns - 7.5 ns |
| Bun | complete | `warmResolveValue` | awilix | 2 / 11 | 18.5 ns | 18.2 ns - 20.1 ns |
| Bun | complete | `warmResolveValue` | inversify-jit | 3 / 11 | 25.1 ns | 25.0 ns - 30.4 ns |
| Bun | complete | `warmResolveValue` | inversify | 4 / 11 | 25.3 ns | 24.9 ns - 29.2 ns |
| Bun | complete | `warmResolveValue` | typedi | 5 / 11 | 25.4 ns | 24.9 ns - 27.1 ns |
| Bun | complete | `warmResolveValue` | scope-di-codegen | 6 / 11 | 27.9 ns | 26.5 ns - 31.3 ns |
| Bun | complete | `warmResolveValue` | needle-di | 7 / 11 | 28.8 ns | 26.7 ns - 30.9 ns |
| Bun | complete | `warmResolveValue` | scope-di-module-reload-codegen | 8 / 11 | 29.5 ns | 27.2 ns - 41.7 ns |
| Bun | complete | `warmResolveValue` | scope-di | 9 / 11 | 30.0 ns | 27.3 ns - 34.1 ns |
| Bun | complete | `warmResolveValue` | scope-di-module-reload | 10 / 11 | 30.4 ns | 26.3 ns - 34.8 ns |
| Bun | complete | `warmResolveValue` | tsyringe | 11 / 11 | 71.5 ns | 66.7 ns - 84.0 ns |
| Bun | complete | `coldResolveValue` | typed-inject | 1 / 9 | 10.7 ns | 10.5 ns - 12.8 ns |
| Bun | complete | `coldResolveValue` | typedi | 2 / 9 | 48.9 ns | 45.5 ns - 51.4 ns |
| Bun | complete | `coldResolveValue` | awilix | 3 / 9 | 107.7 ns | 100.5 ns - 112.5 ns |
| Bun | complete | `coldResolveValue` | scope-di | 4 / 9 | 149.5 ns | 145.4 ns - 169.8 ns |
| Bun | complete | `coldResolveValue` | scope-di-codegen | 5 / 9 | 157.0 ns | 145.0 ns - 172.4 ns |
| Bun | complete | `coldResolveValue` | tsyringe | 6 / 9 | 278.7 ns | 248.2 ns - 283.0 ns |
| Bun | complete | `coldResolveValue` | needle-di | 7 / 9 | 12.60 us | 263.5 ns - 12.80 us |
| Bun | complete | `coldResolveValue` | inversify | 8 / 9 | 23.10 us | 22.80 us - 24.30 us |
| Bun | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 23.60 us | 23.10 us - 24.90 us |
| Bun | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 7.3 ns | 7.2 ns - 7.5 ns |
| Bun | complete | `warmResolveSingletonClass` | awilix | 2 / 11 | 11.1 ns | 10.7 ns - 11.6 ns |
| Bun | complete | `warmResolveSingletonClass` | inversify-jit | 3 / 11 | 23.8 ns | 23.6 ns - 24.0 ns |
| Bun | complete | `warmResolveSingletonClass` | inversify | 4 / 11 | 24.6 ns | 23.7 ns - 24.9 ns |
| Bun | complete | `warmResolveSingletonClass` | typedi | 5 / 11 | 26.3 ns | 25.8 ns - 30.0 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload | 6 / 11 | 26.5 ns | 26.3 ns - 33.9 ns |
| Bun | complete | `warmResolveSingletonClass` | needle-di | 7 / 11 | 26.5 ns | 26.1 ns - 29.6 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di | 8 / 11 | 26.6 ns | 26.6 ns - 29.3 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 9 / 11 | 27.5 ns | 26.2 ns - 29.4 ns |
| Bun | complete | `warmResolveSingletonClass` | scope-di-codegen | 10 / 11 | 28.2 ns | 26.2 ns - 31.5 ns |
| Bun | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 83.3 ns | 63.8 ns - 94.2 ns |
| Bun | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 91.3 ns | 88.7 ns - 95.2 ns |
| Bun | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 176.7 ns | 164.1 ns - 178.1 ns |
| Bun | complete | `coldResolveSingletonClass` | scope-di | 3 / 9 | 183.6 ns | 170.9 ns - 194.2 ns |
| Bun | complete | `coldResolveSingletonClass` | needle-di | 4 / 9 | 316.8 ns | 313.7 ns - 12.80 us |
| Bun | complete | `coldResolveSingletonClass` | tsyringe | 5 / 9 | 378.4 ns | 322.8 ns - 388.1 ns |
| Bun | complete | `coldResolveSingletonClass` | awilix | 6 / 9 | 394.2 ns | 370.9 ns - 446.1 ns |
| Bun | complete | `coldResolveSingletonClass` | typedi | 7 / 9 | 11.70 us | 241.7 ns - 12.60 us |
| Bun | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 30.70 us | 29.80 us - 32.30 us |
| Bun | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 31.00 us | 30.40 us - 31.70 us |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload | 1 / 10 | 24.4 ns | 24.3 ns - 27.7 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 2 / 10 | 24.7 ns | 24.3 ns - 27.5 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di | 3 / 10 | 25.0 ns | 24.9 ns - 28.6 ns |
| Bun | complete | `warmResolveTransientClass` | inversify | 4 / 10 | 25.6 ns | 25.4 ns - 28.7 ns |
| Bun | complete | `warmResolveTransientClass` | scope-di-codegen | 5 / 10 | 26.8 ns | 24.3 ns - 27.8 ns |
| Bun | complete | `warmResolveTransientClass` | inversify-jit | 6 / 10 | 28.1 ns | 28.0 ns - 29.8 ns |
| Bun | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 61.3 ns | 51.5 ns - 63.7 ns |
| Bun | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 66.5 ns | 65.7 ns - 72.8 ns |
| Bun | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 103.8 ns | 76.5 ns - 118.8 ns |
| Bun | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 193.1 ns | 188.0 ns - 244.5 ns |
| Bun | complete | `coldResolveTransientClass` | typed-inject | 1 / 8 | 67.6 ns | 59.2 ns - 73.1 ns |
| Bun | complete | `coldResolveTransientClass` | scope-di | 2 / 8 | 78.9 ns | 76.6 ns - 86.0 ns |
| Bun | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 231.8 ns | 209.1 ns - 11.70 us |
| Bun | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 288.4 ns | 282.5 ns - 359.2 ns |
| Bun | complete | `coldResolveTransientClass` | awilix | 5 / 8 | 331.4 ns | 291.8 ns - 360.2 ns |
| Bun | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 9.58 us | 9.52 us - 9.74 us |
| Bun | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 30.00 us | 29.10 us - 30.50 us |
| Bun | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 75.10 us | 69.80 us - 77.70 us |
| Bun | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 7.2 ns | 7.1 ns - 7.5 ns |
| Bun | complete | `warmResolveSingletonFactory` | awilix | 2 / 11 | 10.9 ns | 10.8 ns - 11.3 ns |
| Bun | complete | `warmResolveSingletonFactory` | inversify | 3 / 11 | 24.0 ns | 23.8 ns - 24.8 ns |
| Bun | complete | `warmResolveSingletonFactory` | inversify-jit | 4 / 11 | 24.2 ns | 23.9 ns - 25.6 ns |
| Bun | complete | `warmResolveSingletonFactory` | needle-di | 5 / 11 | 26.8 ns | 26.3 ns - 30.2 ns |
| Bun | complete | `warmResolveSingletonFactory` | typedi | 6 / 11 | 26.8 ns | 26.0 ns - 30.8 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-codegen | 7 / 11 | 27.7 ns | 26.2 ns - 30.9 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 8 / 11 | 28.0 ns | 26.5 ns - 33.6 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di | 9 / 11 | 28.9 ns | 26.2 ns - 31.2 ns |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 10 / 11 | 28.9 ns | 28.1 ns - 41.7 ns |
| Bun | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 70.7 ns | 63.7 ns - 87.4 ns |
| Bun | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 69.6 ns | 67.9 ns - 72.7 ns |
| Bun | complete | `coldResolveSingletonFactory` | typed-inject | 2 / 9 | 97.9 ns | 93.4 ns - 99.7 ns |
| Bun | complete | `coldResolveSingletonFactory` | scope-di | 3 / 9 | 157.5 ns | 145.7 ns - 173.9 ns |
| Bun | complete | `coldResolveSingletonFactory` | scope-di-codegen | 4 / 9 | 158.1 ns | 150.6 ns - 165.6 ns |
| Bun | complete | `coldResolveSingletonFactory` | needle-di | 5 / 9 | 296.6 ns | 294.2 ns - 13.00 us |
| Bun | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 306.7 ns | 292.8 ns - 316.4 ns |
| Bun | complete | `coldResolveSingletonFactory` | tsyringe | 7 / 9 | 326.3 ns | 323.2 ns - 337.3 ns |
| Bun | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 27.70 us | 27.20 us - 29.20 us |
| Bun | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 27.70 us | 26.90 us - 28.50 us |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 1 / 10 | 26.1 ns | 25.9 ns - 29.2 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 2 / 10 | 26.6 ns | 26.3 ns - 28.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 3 / 10 | 26.7 ns | 26.4 ns - 27.6 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 4 / 10 | 27.1 ns | 26.1 ns - 31.0 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 5 / 10 | 27.6 ns | 26.6 ns - 33.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 6 / 10 | 30.0 ns | 29.3 ns - 33.6 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 7 / 10 | 30.9 ns | 25.9 ns - 33.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 8 / 10 | 32.9 ns | 32.6 ns - 42.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 9 / 10 | 67.7 ns | 60.7 ns - 71.2 ns |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 85.1 ns | 77.1 ns - 97.9 ns |
| Bun | complete | `warmResolveTransientFactory` | awilix | 1 / 10 | 23.5 ns | 22.4 ns - 27.0 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 2 / 10 | 24.7 ns | 24.3 ns - 27.0 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload | 3 / 10 | 24.8 ns | 24.5 ns - 27.4 ns |
| Bun | complete | `warmResolveTransientFactory` | inversify | 4 / 10 | 25.5 ns | 25.3 ns - 25.7 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di-codegen | 5 / 10 | 25.8 ns | 24.7 ns - 28.7 ns |
| Bun | complete | `warmResolveTransientFactory` | scope-di | 6 / 10 | 26.4 ns | 25.3 ns - 31.1 ns |
| Bun | complete | `warmResolveTransientFactory` | inversify-jit | 7 / 10 | 28.7 ns | 28.3 ns - 30.1 ns |
| Bun | complete | `warmResolveTransientFactory` | typedi | 8 / 10 | 31.1 ns | 30.8 ns - 34.9 ns |
| Bun | complete | `warmResolveTransientFactory` | typed-inject | 9 / 10 | 52.5 ns | 51.4 ns - 62.5 ns |
| Bun | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 76.2 ns | 69.0 ns - 102.8 ns |
| Bun | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 43.6 ns | 43.1 ns - 44.3 ns |
| Bun | complete | `coldResolveTransientFactory` | typed-inject | 2 / 8 | 68.2 ns | 66.7 ns - 70.3 ns |
| Bun | complete | `coldResolveTransientFactory` | scope-di | 3 / 8 | 77.7 ns | 76.2 ns - 81.9 ns |
| Bun | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 182.6 ns | 175.6 ns - 194.5 ns |
| Bun | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 316.0 ns | 301.3 ns - 326.3 ns |
| Bun | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 9.51 us | 9.41 us - 9.72 us |
| Bun | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 27.20 us | 26.10 us - 28.20 us |
| Bun | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 72.70 us | 70.70 us - 73.20 us |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 1 / 10 | 50.2 ns | 46.5 ns - 61.7 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify-jit | 2 / 10 | 52.3 ns | 51.0 ns - 66.8 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 3 / 10 | 53.3 ns | 46.2 ns - 56.1 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 4 / 10 | 54.6 ns | 46.1 ns - 60.2 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify | 5 / 10 | 54.9 ns | 53.5 ns - 55.6 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di | 6 / 10 | 55.7 ns | 49.7 ns - 60.4 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | awilix | 7 / 10 | 87.6 ns | 87.3 ns - 91.2 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | typedi | 8 / 10 | 88.7 ns | 87.5 ns - 96.0 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | tsyringe | 9 / 10 | 221.0 ns | 211.9 ns - 265.1 ns |
| Bun | complete | `warmResolveTransientFactoryChain` | typed-inject | 10 / 10 | 240.6 ns | 217.9 ns - 257.3 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 179.2 ns | 175.3 ns - 185.4 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di | 2 / 8 | 209.7 ns | 180.2 ns - 219.8 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | typed-inject | 3 / 8 | 474.5 ns | 458.0 ns - 496.8 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | tsyringe | 4 / 8 | 743.5 ns | 739.3 ns - 756.1 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | awilix | 5 / 8 | 949.7 ns | 939.6 ns - 967.7 ns |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 34.33 us | 32.78 us - 34.70 us |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 38.90 us | 37.60 us - 40.80 us |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 153.30 us | 150.40 us - 167.60 us |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 64.4 ns | 57.6 ns - 75.6 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 2 / 10 | 65.2 ns | 59.7 ns - 93.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 3 / 10 | 69.0 ns | 64.1 ns - 81.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 4 / 10 | 96.4 ns | 89.5 ns - 107.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 121.5 ns | 116.3 ns - 131.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 138.2 ns | 137.7 ns - 149.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 7 / 10 | 403.3 ns | 376.1 ns - 419.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 8 / 10 | 404.2 ns | 379.1 ns - 426.2 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 9 / 10 | 477.0 ns | 398.9 ns - 591.5 ns |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 981.7 ns | 954.3 ns - 1.02 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 613.0 ns | 590.9 ns - 659.2 ns |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 2 / 8 | 910.4 ns | 887.0 ns - 1.00 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 3 / 8 | 1.68 us | 1.62 us - 1.72 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 4 / 8 | 2.04 us | 1.96 us - 2.09 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 5 / 8 | 12.30 us | 12.00 us - 12.50 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 6 / 8 | 50.90 us | 49.60 us - 53.70 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 7 / 8 | 95.50 us | 94.70 us - 97.10 us |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 218.80 us | 215.20 us - 224.60 us |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 77.0 ns | 72.6 ns - 93.1 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 93.8 ns | 74.7 ns - 105.6 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 3 / 10 | 124.5 ns | 117.9 ns - 148.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 149.8 ns | 145.5 ns - 161.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 5 / 10 | 150.8 ns | 131.2 ns - 172.9 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 6 / 10 | 158.4 ns | 145.7 ns - 188.1 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 7 / 10 | 442.7 ns | 411.0 ns - 515.0 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 475.9 ns | 453.6 ns - 521.3 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 9 / 10 | 650.5 ns | 468.2 ns - 696.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 1.19 us | 1.16 us - 1.28 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 896.9 ns | 864.9 ns - 934.4 ns |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 2 / 8 | 1.19 us | 1.04 us - 1.24 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 3 / 8 | 1.78 us | 1.78 us - 1.83 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 4 / 8 | 2.34 us | 2.21 us - 2.75 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 5 / 8 | 12.80 us | 12.60 us - 12.90 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 6 / 8 | 55.90 us | 51.70 us - 57.60 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 7 / 8 | 108.10 us | 106.90 us - 124.00 us |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 261.80 us | 243.80 us - 268.90 us |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 1 / 10 | 73.3 ns | 64.1 ns - 106.4 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 2 / 10 | 81.0 ns | 70.6 ns - 84.8 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 3 / 10 | 81.5 ns | 79.2 ns - 95.5 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 4 / 10 | 87.0 ns | 67.1 ns - 104.7 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 5 / 10 | 94.2 ns | 78.2 ns - 95.1 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify | 6 / 10 | 101.0 ns | 98.5 ns - 120.8 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | awilix | 7 / 10 | 266.5 ns | 259.4 ns - 271.6 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typedi | 8 / 10 | 396.1 ns | 386.1 ns - 397.2 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 9 / 10 | 422.2 ns | 414.6 ns - 499.3 ns |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 478.7 ns | 449.6 ns - 520.3 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 676.9 ns | 666.0 ns - 743.2 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 2 / 8 | 852.2 ns | 829.6 ns - 862.0 ns |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 3 / 8 | 1.77 us | 1.75 us - 1.78 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | awilix | 4 / 8 | 1.99 us | 1.90 us - 2.19 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typedi | 5 / 8 | 13.40 us | 594.2 ns - 13.90 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify | 6 / 8 | 49.90 us | 48.90 us - 53.30 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 7 / 8 | 96.10 us | 95.70 us - 113.80 us |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 247.20 us | 243.80 us - 260.50 us |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 1 / 10 | 136.9 ns | 129.4 ns - 154.8 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 2 / 10 | 142.9 ns | 142.3 ns - 165.5 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 3 / 10 | 183.4 ns | 176.0 ns - 234.2 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 4 / 10 | 214.4 ns | 185.2 ns - 240.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 5 / 10 | 229.3 ns | 222.9 ns - 240.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 6 / 10 | 246.1 ns | 227.3 ns - 250.4 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 7 / 10 | 816.0 ns | 761.6 ns - 894.7 ns |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 8 / 10 | 930.3 ns | 871.4 ns - 1.05 us |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 9 / 10 | 1.14 us | 1.07 us - 1.26 us |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 1.94 us | 1.92 us - 2.07 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 1.23 us | 1.19 us - 1.24 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 2 / 8 | 1.65 us | 1.60 us - 1.73 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 3 / 8 | 2.64 us | 2.43 us - 13.00 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 4 / 8 | 3.29 us | 3.10 us - 3.79 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 5 / 8 | 16.70 us | 16.30 us - 17.60 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 6 / 8 | 62.00 us | 59.50 us - 62.70 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 7 / 8 | 149.90 us | 149.50 us - 175.40 us |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 329.70 us | 318.70 us - 334.50 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 337.7 ns | 333.9 ns - 396.9 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 2 / 10 | 343.6 ns | 334.9 ns - 350.7 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 356.1 ns | 351.5 ns - 427.1 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 4 / 10 | 363.1 ns | 352.7 ns - 373.4 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 5 / 10 | 782.5 ns | 777.2 ns - 794.2 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 6 / 10 | 786.8 ns | 769.1 ns - 791.6 ns |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 7 / 10 | 2.13 us | 2.11 us - 2.21 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 8 / 10 | 2.95 us | 2.82 us - 3.42 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 9 / 10 | 3.78 us | 3.61 us - 4.20 us |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 28.10 us | 27.80 us - 30.00 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 3.10 us | 2.88 us - 3.20 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 2 / 8 | 4.45 us | 4.32 us - 16.00 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 3 / 8 | 11.18 us | 11.05 us - 11.83 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 4 / 8 | 23.70 us | 22.90 us - 24.40 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 5 / 8 | 28.20 us | 27.90 us - 30.30 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 6 / 8 | 95.70 us | 94.80 us - 99.80 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 7 / 8 | 369.90 us | 365.40 us - 430.50 us |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 814.10 us | 798.10 us - 915.40 us |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 134.7 ns | 128.2 ns - 142.0 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 138.4 ns | 128.1 ns - 175.8 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify | 3 / 10 | 174.8 ns | 160.0 ns - 197.7 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 4 / 10 | 176.4 ns | 157.0 ns - 197.0 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 5 / 10 | 224.7 ns | 214.9 ns - 259.2 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 6 / 10 | 251.3 ns | 249.4 ns - 281.8 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 7 / 10 | 256.1 ns | 249.9 ns - 273.5 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | awilix | 8 / 10 | 267.5 ns | 250.8 ns - 270.7 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typedi | 9 / 10 | 340.8 ns | 333.6 ns - 366.3 ns |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 644.9 ns | 620.2 ns - 664.1 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 338.6 ns | 336.5 ns - 449.1 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 345.5 ns | 334.3 ns - 436.3 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 376.3 ns | 365.5 ns - 483.3 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 4 / 10 | 392.0 ns | 380.1 ns - 393.4 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 5 / 10 | 733.8 ns | 727.5 ns - 750.4 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 744.8 ns | 730.0 ns - 754.7 ns |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 7 / 10 | 1.07 us | 1.06 us - 1.18 us |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 8 / 10 | 1.25 us | 1.18 us - 1.33 us |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 9 / 10 | 2.41 us | 2.22 us - 3.03 us |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 10 / 10 | 2.53 us | 2.44 us - 2.59 us |

## Memory Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Allocations |
| --- | --- | --- | --- | ---: | ---: |
| Bun | complete | `registrationClass` | typed-inject | 1 / 9 | 348 B |
| Bun | complete | `registrationClass` | tsyringe | 2 / 9 | 480 B |
| Bun | complete | `registrationClass` | typedi | 3 / 9 | 659 B |
| Bun | complete | `registrationClass` | needle-di | 4 / 9 | 706 B |
| Bun | complete | `registrationClass` | scope-di | 5 / 9 | 1.65 KB |
| Bun | complete | `registrationClass` | scope-di-codegen | 6 / 9 | 1.82 KB |
| Bun | complete | `registrationClass` | awilix | 7 / 9 | 4.60 KB |
| Bun | complete | `registrationClass` | inversify | 8 / 9 | 13.39 KB |
| Bun | complete | `registrationClass` | inversify-jit | 9 / 9 | 14.05 KB |
| Bun | complete | `registrationValue` | typed-inject | 1 / 9 | 328 B |
| Bun | complete | `registrationValue` | tsyringe | 2 / 9 | 431 B |
| Bun | complete | `registrationValue` | needle-di | 3 / 9 | 500 B |
| Bun | complete | `registrationValue` | typedi | 4 / 9 | 747 B |
| Bun | complete | `registrationValue` | awilix | 5 / 9 | 953 B |
| Bun | complete | `registrationValue` | scope-di | 6 / 9 | 1.15 KB |
| Bun | complete | `registrationValue` | scope-di-codegen | 7 / 9 | 1.31 KB |
| Bun | complete | `registrationValue` | inversify | 8 / 9 | 8.15 KB |
| Bun | complete | `registrationValue` | inversify-jit | 9 / 9 | 9.37 KB |
| Bun | complete | `registrationFactory` | typed-inject | 1 / 9 | 298 B |
| Bun | complete | `registrationFactory` | needle-di | 2 / 9 | 459 B |
| Bun | complete | `registrationFactory` | tsyringe | 3 / 9 | 587 B |
| Bun | complete | `registrationFactory` | typedi | 4 / 9 | 640 B |
| Bun | complete | `registrationFactory` | scope-di-codegen | 5 / 9 | 1.22 KB |
| Bun | complete | `registrationFactory` | scope-di | 6 / 9 | 1.39 KB |
| Bun | complete | `registrationFactory` | awilix | 7 / 9 | 2.92 KB |
| Bun | complete | `registrationFactory` | inversify | 8 / 9 | 11.33 KB |
| Bun | complete | `registrationFactory` | inversify-jit | 9 / 9 | 11.46 KB |
| Bun | complete | `warmResolveValue` | typed-inject | 1 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | inversify | 2 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | inversify-jit | 3 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di-module-reload-codegen | 4 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di | 5 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | scope-di-codegen | 6 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | typedi | 7 / 11 | 0 B |
| Bun | complete | `warmResolveValue` | awilix | 8 / 11 | 1 B |
| Bun | complete | `warmResolveValue` | scope-di-module-reload | 9 / 11 | 1 B |
| Bun | complete | `warmResolveValue` | needle-di | 10 / 11 | 1 B |
| Bun | complete | `warmResolveValue` | tsyringe | 11 / 11 | 1 B |
| Bun | complete | `coldResolveValue` | typed-inject | 1 / 9 | 0 B |
| Bun | complete | `coldResolveValue` | typedi | 2 / 9 | 0 B |
| Bun | complete | `coldResolveValue` | awilix | 3 / 9 | 1 B |
| Bun | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 1 B |
| Bun | complete | `coldResolveValue` | scope-di | 5 / 9 | 1 B |
| Bun | complete | `coldResolveValue` | tsyringe | 6 / 9 | 6 B |
| Bun | complete | `coldResolveValue` | needle-di | 7 / 9 | 209 B |
| Bun | complete | `coldResolveValue` | inversify | 8 / 9 | 704 B |
| Bun | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 758 B |
| Bun | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 2 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | inversify-jit | 3 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | inversify | 4 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di-codegen | 5 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | typedi | 6 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | awilix | 7 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | needle-di | 8 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di-module-reload | 9 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonClass` | scope-di | 10 / 11 | 1 B |
| Bun | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | scope-di | 1 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonClass` | typed-inject | 3 / 9 | 2 B |
| Bun | complete | `coldResolveSingletonClass` | needle-di | 4 / 9 | 4 B |
| Bun | complete | `coldResolveSingletonClass` | awilix | 5 / 9 | 6 B |
| Bun | complete | `coldResolveSingletonClass` | tsyringe | 6 / 9 | 7 B |
| Bun | complete | `coldResolveSingletonClass` | typedi | 7 / 9 | 95 B |
| Bun | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 1.04 KB |
| Bun | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 1.09 KB |
| Bun | complete | `warmResolveTransientClass` | scope-di-codegen | 1 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | inversify | 2 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | inversify-jit | 3 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 4 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | scope-di-module-reload | 5 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | scope-di | 6 / 10 | 0 B |
| Bun | complete | `warmResolveTransientClass` | awilix | 7 / 10 | 2 B |
| Bun | complete | `warmResolveTransientClass` | tsyringe | 8 / 10 | 2 B |
| Bun | complete | `warmResolveTransientClass` | typed-inject | 9 / 10 | 2 B |
| Bun | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 8 B |
| Bun | complete | `coldResolveTransientClass` | scope-di | 1 / 8 | 1 B |
| Bun | complete | `coldResolveTransientClass` | typed-inject | 2 / 8 | 2 B |
| Bun | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 3 B |
| Bun | complete | `coldResolveTransientClass` | awilix | 4 / 8 | 4 B |
| Bun | complete | `coldResolveTransientClass` | tsyringe | 5 / 8 | 6 B |
| Bun | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 99 B |
| Bun | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 991 B |
| Bun | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 2.27 KB |
| Bun | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | inversify-jit | 2 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | inversify | 3 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 4 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-codegen | 5 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 6 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | typedi | 7 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | scope-di | 8 / 11 | 0 B |
| Bun | complete | `warmResolveSingletonFactory` | awilix | 9 / 11 | 1 B |
| Bun | complete | `warmResolveSingletonFactory` | needle-di | 10 / 11 | 1 B |
| Bun | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 0 B |
| Bun | complete | `coldResolveSingletonFactory` | scope-di | 2 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | typed-inject | 4 / 9 | 1 B |
| Bun | complete | `coldResolveSingletonFactory` | needle-di | 5 / 9 | 4 B |
| Bun | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 6 B |
| Bun | complete | `coldResolveSingletonFactory` | tsyringe | 7 / 9 | 6 B |
| Bun | complete | `coldResolveSingletonFactory` | inversify-jit | 8 / 9 | 917 B |
| Bun | complete | `coldResolveSingletonFactory` | inversify | 9 / 9 | 941 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 1 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 2 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 3 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 4 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 5 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 6 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 7 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 8 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 9 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 1 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | inversify | 2 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di-codegen | 3 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di | 4 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | scope-di-module-reload | 5 / 10 | 0 B |
| Bun | complete | `warmResolveTransientFactory` | inversify-jit | 6 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | awilix | 7 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | typedi | 8 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | tsyringe | 9 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactory` | typed-inject | 10 / 10 | 1 B |
| Bun | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 0 B |
| Bun | complete | `coldResolveTransientFactory` | scope-di | 2 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactory` | typed-inject | 3 / 8 | 2 B |
| Bun | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 2 B |
| Bun | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 96 B |
| Bun | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 853 B |
| Bun | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 2.21 KB |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 1 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify | 2 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | inversify-jit | 3 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 4 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 5 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | scope-di | 6 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryChain` | tsyringe | 7 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryChain` | awilix | 8 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryChain` | typedi | 9 / 10 | 6 B |
| Bun | complete | `warmResolveTransientFactoryChain` | typed-inject | 10 / 10 | 11 B |
| Bun | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 1 B |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di | 2 / 8 | 3 B |
| Bun | complete | `coldResolveTransientFactoryChain` | typed-inject | 3 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactoryChain` | awilix | 4 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 22 B |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify | 6 / 8 | 1.38 KB |
| Bun | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 7 / 8 | 4.74 KB |
| Bun | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 6.04 KB |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 3 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 2 / 10 | 3 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 3 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 4 / 10 | 4 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 6 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 12 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 7 / 10 | 23 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 8 / 10 | 28 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 35 B |
| Bun | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 10 / 10 | 35 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 1 / 8 | 4 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 2 / 8 | 8 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 3 / 8 | 17 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 4 / 8 | 107 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 5 / 8 | 133 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 6 / 8 | 618 B |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 1.86 KB |
| Bun | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 9.99 KB |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 7 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 2 / 10 | 7 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 3 / 10 | 8 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 9 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 10 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 14 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 7 / 10 | 16 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 8 / 10 | 29 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 9 / 10 | 43 B |
| Bun | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 10 / 10 | 50 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 1 / 8 | 4 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 2 / 8 | 11 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 3 / 8 | 25 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 4 / 8 | 128 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 5 / 8 | 152 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 6 / 8 | 637 B |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 2.29 KB |
| Bun | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 10.58 KB |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 1 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 2 / 10 | 1 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 2 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 2 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 5 / 10 | 2 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | inversify | 6 / 10 | 3 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 7 / 10 | 12 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | awilix | 8 / 10 | 23 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typedi | 9 / 10 | 31 B |
| Bun | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 10 / 10 | 32 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | awilix | 2 / 8 | 6 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 3 / 8 | 11 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 4 / 8 | 72 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | typedi | 5 / 8 | 110 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 730 B |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 1.85 KB |
| Bun | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 11.23 KB |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 1 / 10 | 12 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 2 / 10 | 13 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 3 / 10 | 13 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 4 / 10 | 19 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 5 / 10 | 19 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 6 / 10 | 22 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 7 / 10 | 52 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 8 / 10 | 63 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 86 B |
| Bun | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 97 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 8 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 2 / 8 | 8 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 3 / 8 | 61 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 4 / 8 | 247 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 5 / 8 | 272 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 6 / 8 | 855 B |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 7 / 8 | 2.10 KB |
| Bun | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 11.11 KB |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 1 / 10 | 25 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 2 / 10 | 35 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 3 / 10 | 45 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 4 / 10 | 51 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 5 / 10 | 57 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 171 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 7 / 10 | 195 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 8 / 10 | 210 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 9 / 10 | 244 B |
| Bun | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 10 / 10 | 274 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 1 / 8 | 12 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 2 / 8 | 27 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 3 / 8 | 348 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 4 / 8 | 533 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 5 / 8 | 554 B |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 6 / 8 | 2.82 KB |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 7 / 8 | 3.57 KB |
| Bun | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 20.79 KB |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 1 / 10 | 3 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 3 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 3 / 10 | 4 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 4 / 10 | 4 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify | 5 / 10 | 6 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 6 / 10 | 6 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | awilix | 7 / 10 | 10 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 8 / 10 | 12 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 9 / 10 | 13 B |
| Bun | complete | `warmResolveCachedFactoryWideGraph` | typedi | 10 / 10 | 37 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 1 / 10 | 6 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 2 / 10 | 10 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 3 / 10 | 15 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 4 / 10 | 17 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 5 / 10 | 20 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 28 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 7 / 10 | 52 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 8 / 10 | 71 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 9 / 10 | 74 B |
| Bun | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 10 / 10 | 75 B |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Bun | 1.4.2 | Boni / AMD Ryzen 7 3800X 8-Core Processor / win32 10.0.22631 x64 | complete | 300 | [`bench_bun_json_complete.json`](./bench_bun_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | 7de000ef198459b0a478103290b40a43dc266e0e |
| Branch | chore/benchmarks |
