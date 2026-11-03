# Node.js Benchmark Report

[Scope DI startup report](./bench_node_json_complete.startup.md)

Each case is measured in fresh processes. Time is the median of process medians; the range shows the minimum and maximum process medians. Allocations are the median of process allocation averages. Raw JSON retains every process measurement.

Library results were collected independently. Rankings compare the case measurements below.

- [scope-di raw results](bench_node_json_complete/scope-di.json)
- [inversify raw results](bench_node_json_complete/inversify.json)
- [tsyringe raw results](bench_node_json_complete/tsyringe.json)
- [awilix raw results](bench_node_json_complete/awilix.json)
- [typedi raw results](bench_node_json_complete/typedi.json)
- [typed-inject raw results](bench_node_json_complete/typed-inject.json)
- [needle-di raw results](bench_node_json_complete/needle-di.json)

## Speed Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Time | Process median range |
| --- | --- | --- | --- | ---: | ---: | --- |
| Node.js | complete | `registrationClass` | tsyringe | 1 / 9 | 297.70 us | 292.10 us - 392.50 us |
| Node.js | complete | `registrationClass` | typed-inject | 2 / 9 | 301.90 us | 286.50 us - 370.50 us |
| Node.js | complete | `registrationClass` | scope-di | 3 / 9 | 361.80 us | 357.70 us - 447.10 us |
| Node.js | complete | `registrationClass` | scope-di-codegen | 4 / 9 | 362.80 us | 356.50 us - 558.90 us |
| Node.js | complete | `registrationClass` | typedi | 5 / 9 | 585.40 us | 576.80 us - 589.60 us |
| Node.js | complete | `registrationClass` | needle-di | 6 / 9 | 633.10 us | 544.00 us - 689.80 us |
| Node.js | complete | `registrationClass` | awilix | 7 / 9 | 1.36 ms | 1.33 ms - 1.43 ms |
| Node.js | complete | `registrationClass` | inversify-jit | 8 / 9 | 2.96 ms | 2.91 ms - 3.01 ms |
| Node.js | complete | `registrationClass` | inversify | 9 / 9 | 2.96 ms | 2.92 ms - 2.98 ms |
| Node.js | complete | `registrationValue` | tsyringe | 1 / 9 | 27.40 us | 26.80 us - 27.70 us |
| Node.js | complete | `registrationValue` | needle-di | 2 / 9 | 143.00 us | 142.70 us - 148.80 us |
| Node.js | complete | `registrationValue` | typed-inject | 3 / 9 | 156.50 us | 151.90 us - 162.10 us |
| Node.js | complete | `registrationValue` | typedi | 4 / 9 | 199.60 us | 195.80 us - 207.20 us |
| Node.js | complete | `registrationValue` | scope-di-codegen | 5 / 9 | 255.10 us | 250.50 us - 259.50 us |
| Node.js | complete | `registrationValue` | scope-di | 6 / 9 | 257.10 us | 251.40 us - 269.30 us |
| Node.js | complete | `registrationValue` | awilix | 7 / 9 | 456.50 us | 445.40 us - 463.90 us |
| Node.js | complete | `registrationValue` | inversify-jit | 8 / 9 | 2.48 ms | 2.47 ms - 2.50 ms |
| Node.js | complete | `registrationValue` | inversify | 9 / 9 | 2.48 ms | 2.47 ms - 2.50 ms |
| Node.js | complete | `registrationFactory` | tsyringe | 1 / 9 | 29.20 us | 27.00 us - 30.90 us |
| Node.js | complete | `registrationFactory` | typed-inject | 2 / 9 | 164.40 us | 159.80 us - 167.30 us |
| Node.js | complete | `registrationFactory` | scope-di | 3 / 9 | 237.10 us | 232.40 us - 238.50 us |
| Node.js | complete | `registrationFactory` | scope-di-codegen | 4 / 9 | 241.50 us | 237.40 us - 244.30 us |
| Node.js | complete | `registrationFactory` | needle-di | 5 / 9 | 290.20 us | 287.10 us - 294.80 us |
| Node.js | complete | `registrationFactory` | typedi | 6 / 9 | 405.50 us | 399.30 us - 474.60 us |
| Node.js | complete | `registrationFactory` | awilix | 7 / 9 | 720.30 us | 709.90 us - 740.80 us |
| Node.js | complete | `registrationFactory` | inversify | 8 / 9 | 2.64 ms | 2.62 ms - 2.69 ms |
| Node.js | complete | `registrationFactory` | inversify-jit | 9 / 9 | 2.70 ms | 2.64 ms - 3.08 ms |
| Node.js | complete | `warmResolveValue` | typed-inject | 1 / 11 | 0.9 ns | 0.9 ns - 1.1 ns |
| Node.js | complete | `warmResolveValue` | typedi | 2 / 11 | 10.6 ns | 10.5 ns - 12.8 ns |
| Node.js | complete | `warmResolveValue` | inversify-jit | 3 / 11 | 14.0 ns | 13.9 ns - 17.0 ns |
| Node.js | complete | `warmResolveValue` | awilix | 4 / 11 | 15.9 ns | 15.6 ns - 18.1 ns |
| Node.js | complete | `warmResolveValue` | inversify | 5 / 11 | 16.7 ns | 13.9 ns - 17.2 ns |
| Node.js | complete | `warmResolveValue` | scope-di | 6 / 11 | 20.2 ns | 20.1 ns - 29.6 ns |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload | 7 / 11 | 20.2 ns | 20.1 ns - 22.7 ns |
| Node.js | complete | `warmResolveValue` | scope-di-codegen | 8 / 11 | 20.3 ns | 20.2 ns - 21.4 ns |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload-codegen | 9 / 11 | 20.3 ns | 20.2 ns - 28.1 ns |
| Node.js | complete | `warmResolveValue` | needle-di | 10 / 11 | 32.5 ns | 24.0 ns - 34.6 ns |
| Node.js | complete | `warmResolveValue` | tsyringe | 11 / 11 | 178.9 ns | 163.4 ns - 188.3 ns |
| Node.js | complete | `coldResolveValue` | typed-inject | 1 / 9 | 9.1 ns | 8.9 ns - 9.2 ns |
| Node.js | complete | `coldResolveValue` | typedi | 2 / 9 | 31.4 ns | 24.0 ns - 33.3 ns |
| Node.js | complete | `coldResolveValue` | scope-di | 3 / 9 | 129.4 ns | 115.4 ns - 131.9 ns |
| Node.js | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 129.7 ns | 112.6 ns - 134.0 ns |
| Node.js | complete | `coldResolveValue` | awilix | 5 / 9 | 323.4 ns | 314.9 ns - 336.0 ns |
| Node.js | complete | `coldResolveValue` | tsyringe | 6 / 9 | 357.3 ns | 340.2 ns - 364.0 ns |
| Node.js | complete | `coldResolveValue` | needle-di | 7 / 9 | 872.6 ns | 865.7 ns - 998.7 ns |
| Node.js | complete | `coldResolveValue` | inversify | 8 / 9 | 51.00 us | 48.00 us - 54.60 us |
| Node.js | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 54.00 us | 51.50 us - 56.60 us |
| Node.js | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 0.9 ns | 0.9 ns - 1.0 ns |
| Node.js | complete | `warmResolveSingletonClass` | typedi | 2 / 11 | 10.7 ns | 10.6 ns - 13.3 ns |
| Node.js | complete | `warmResolveSingletonClass` | awilix | 3 / 11 | 13.4 ns | 13.4 ns - 13.6 ns |
| Node.js | complete | `warmResolveSingletonClass` | inversify | 4 / 11 | 15.8 ns | 13.3 ns - 19.7 ns |
| Node.js | complete | `warmResolveSingletonClass` | inversify-jit | 5 / 11 | 16.1 ns | 13.2 ns - 16.4 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload | 6 / 11 | 20.2 ns | 20.2 ns - 22.6 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di | 7 / 11 | 20.2 ns | 20.2 ns - 20.3 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 8 / 11 | 20.2 ns | 20.1 ns - 22.9 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-codegen | 9 / 11 | 20.3 ns | 20.2 ns - 22.9 ns |
| Node.js | complete | `warmResolveSingletonClass` | needle-di | 10 / 11 | 24.0 ns | 24.0 ns - 28.9 ns |
| Node.js | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 170.7 ns | 162.8 ns - 181.3 ns |
| Node.js | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 87.4 ns | 85.8 ns - 111.8 ns |
| Node.js | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 153.2 ns | 146.9 ns - 174.8 ns |
| Node.js | complete | `coldResolveSingletonClass` | scope-di | 3 / 9 | 154.8 ns | 139.2 ns - 168.3 ns |
| Node.js | complete | `coldResolveSingletonClass` | typedi | 4 / 9 | 326.4 ns | 297.5 ns - 336.9 ns |
| Node.js | complete | `coldResolveSingletonClass` | tsyringe | 5 / 9 | 439.8 ns | 388.9 ns - 469.7 ns |
| Node.js | complete | `coldResolveSingletonClass` | awilix | 6 / 9 | 569.7 ns | 541.4 ns - 594.9 ns |
| Node.js | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 872.4 ns | 851.6 ns - 878.1 ns |
| Node.js | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 66.30 us | 62.80 us - 72.00 us |
| Node.js | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 67.30 us | 64.90 us - 69.00 us |
| Node.js | complete | `warmResolveTransientClass` | scope-di-codegen | 1 / 10 | 13.7 ns | 13.5 ns - 14.0 ns |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 2 / 10 | 13.7 ns | 13.4 ns - 16.2 ns |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload | 3 / 10 | 13.8 ns | 13.4 ns - 15.5 ns |
| Node.js | complete | `warmResolveTransientClass` | scope-di | 4 / 10 | 16.3 ns | 13.6 ns - 17.4 ns |
| Node.js | complete | `warmResolveTransientClass` | inversify | 5 / 10 | 18.4 ns | 16.9 ns - 24.0 ns |
| Node.js | complete | `warmResolveTransientClass` | inversify-jit | 6 / 10 | 18.8 ns | 16.4 ns - 19.1 ns |
| Node.js | complete | `warmResolveTransientClass` | awilix | 7 / 10 | 22.4 ns | 21.9 ns - 27.3 ns |
| Node.js | complete | `warmResolveTransientClass` | typed-inject | 8 / 10 | 24.0 ns | 23.7 ns - 26.2 ns |
| Node.js | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 214.6 ns | 204.7 ns - 253.4 ns |
| Node.js | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 250.6 ns | 250.3 ns - 319.8 ns |
| Node.js | complete | `coldResolveTransientClass` | typed-inject | 1 / 8 | 32.8 ns | 31.7 ns - 33.1 ns |
| Node.js | complete | `coldResolveTransientClass` | scope-di | 2 / 8 | 53.6 ns | 44.8 ns - 65.2 ns |
| Node.js | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 256.2 ns | 250.1 ns - 288.1 ns |
| Node.js | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 406.6 ns | 390.7 ns - 423.0 ns |
| Node.js | complete | `coldResolveTransientClass` | awilix | 5 / 8 | 470.5 ns | 457.2 ns - 480.4 ns |
| Node.js | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 10.46 us | 10.40 us - 11.64 us |
| Node.js | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 65.80 us | 60.80 us - 68.20 us |
| Node.js | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 170.10 us | 163.00 us - 172.50 us |
| Node.js | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 0.9 ns | 0.9 ns - 0.9 ns |
| Node.js | complete | `warmResolveSingletonFactory` | typedi | 2 / 11 | 10.6 ns | 10.6 ns - 19.2 ns |
| Node.js | complete | `warmResolveSingletonFactory` | awilix | 3 / 11 | 13.4 ns | 13.4 ns - 13.6 ns |
| Node.js | complete | `warmResolveSingletonFactory` | inversify | 4 / 11 | 15.8 ns | 13.5 ns - 18.0 ns |
| Node.js | complete | `warmResolveSingletonFactory` | inversify-jit | 5 / 11 | 16.2 ns | 13.4 ns - 17.9 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 6 / 11 | 20.1 ns | 20.1 ns - 20.2 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 7 / 11 | 20.2 ns | 20.1 ns - 20.3 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di | 8 / 11 | 20.2 ns | 20.1 ns - 23.2 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-codegen | 9 / 11 | 20.2 ns | 20.2 ns - 25.2 ns |
| Node.js | complete | `warmResolveSingletonFactory` | needle-di | 10 / 11 | 26.5 ns | 24.0 ns - 32.1 ns |
| Node.js | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 184.8 ns | 177.5 ns - 188.8 ns |
| Node.js | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 40.8 ns | 34.7 ns - 42.3 ns |
| Node.js | complete | `coldResolveSingletonFactory` | typed-inject | 2 / 9 | 81.5 ns | 78.1 ns - 84.7 ns |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di | 3 / 9 | 143.8 ns | 128.8 ns - 159.6 ns |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di-codegen | 4 / 9 | 144.3 ns | 137.6 ns - 154.7 ns |
| Node.js | complete | `coldResolveSingletonFactory` | tsyringe | 5 / 9 | 394.1 ns | 368.7 ns - 411.2 ns |
| Node.js | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 544.5 ns | 523.2 ns - 559.5 ns |
| Node.js | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 896.2 ns | 883.6 ns - 908.9 ns |
| Node.js | complete | `coldResolveSingletonFactory` | inversify-jit | 8 / 9 | 62.20 us | 58.30 us - 64.20 us |
| Node.js | complete | `coldResolveSingletonFactory` | inversify | 9 / 9 | 63.50 us | 60.70 us - 65.80 us |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 1 / 10 | 24.8 ns | 21.4 ns - 27.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 2 / 10 | 25.2 ns | 24.7 ns - 33.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 3 / 10 | 25.6 ns | 25.5 ns - 30.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 4 / 10 | 25.8 ns | 25.5 ns - 32.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 5 / 10 | 33.3 ns | 32.8 ns - 40.0 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 6 / 10 | 42.4 ns | 41.3 ns - 49.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 7 / 10 | 43.2 ns | 37.4 ns - 45.0 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 8 / 10 | 43.2 ns | 42.4 ns - 47.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 9 / 10 | 43.5 ns | 40.8 ns - 46.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 202.9 ns | 194.9 ns - 236.4 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-codegen | 1 / 10 | 13.8 ns | 13.7 ns - 17.3 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 2 / 10 | 14.0 ns | 13.7 ns - 16.7 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload | 3 / 10 | 14.2 ns | 13.8 ns - 16.5 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di | 4 / 10 | 14.4 ns | 14.2 ns - 16.9 ns |
| Node.js | complete | `warmResolveTransientFactory` | inversify | 5 / 10 | 16.9 ns | 16.8 ns - 16.9 ns |
| Node.js | complete | `warmResolveTransientFactory` | inversify-jit | 6 / 10 | 16.9 ns | 16.8 ns - 20.0 ns |
| Node.js | complete | `warmResolveTransientFactory` | awilix | 7 / 10 | 22.9 ns | 22.9 ns - 28.3 ns |
| Node.js | complete | `warmResolveTransientFactory` | typedi | 8 / 10 | 23.2 ns | 20.1 ns - 26.3 ns |
| Node.js | complete | `warmResolveTransientFactory` | typed-inject | 9 / 10 | 23.9 ns | 21.4 ns - 28.5 ns |
| Node.js | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 192.1 ns | 170.0 ns - 194.1 ns |
| Node.js | complete | `coldResolveTransientFactory` | typed-inject | 1 / 8 | 26.3 ns | 26.2 ns - 30.7 ns |
| Node.js | complete | `coldResolveTransientFactory` | typedi | 2 / 8 | 33.5 ns | 32.2 ns - 38.1 ns |
| Node.js | complete | `coldResolveTransientFactory` | scope-di | 3 / 8 | 71.8 ns | 58.4 ns - 89.1 ns |
| Node.js | complete | `coldResolveTransientFactory` | tsyringe | 4 / 8 | 415.3 ns | 404.1 ns - 425.4 ns |
| Node.js | complete | `coldResolveTransientFactory` | awilix | 5 / 8 | 442.3 ns | 432.4 ns - 458.2 ns |
| Node.js | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 10.45 us | 10.38 us - 10.62 us |
| Node.js | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 59.20 us | 53.30 us - 63.40 us |
| Node.js | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 167.30 us | 162.50 us - 170.30 us |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 1 / 10 | 31.4 ns | 31.2 ns - 32.5 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 31.6 ns | 31.3 ns - 33.4 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 3 / 10 | 34.2 ns | 34.0 ns - 42.3 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify-jit | 4 / 10 | 43.9 ns | 43.7 ns - 46.8 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di | 5 / 10 | 49.2 ns | 48.3 ns - 58.9 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify | 6 / 10 | 56.8 ns | 56.5 ns - 60.7 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | typedi | 7 / 10 | 73.2 ns | 70.9 ns - 88.0 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | typed-inject | 8 / 10 | 164.8 ns | 158.9 ns - 221.5 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | awilix | 9 / 10 | 186.7 ns | 178.4 ns - 198.8 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 472.2 ns | 274.8 ns - 581.0 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 151.6 ns | 149.8 ns - 153.6 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | typed-inject | 2 / 8 | 202.1 ns | 169.2 ns - 226.7 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di | 3 / 8 | 504.6 ns | 485.2 ns - 550.9 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | awilix | 4 / 8 | 1.04 us | 1.02 us - 1.10 us |
| Node.js | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 1.05 us | 1.04 us - 1.14 us |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 35.56 us | 34.51 us - 37.87 us |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 76.00 us | 70.50 us - 79.00 us |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 268.50 us | 261.90 us - 276.40 us |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 65.9 ns | 55.6 ns - 72.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 2 / 10 | 70.4 ns | 60.8 ns - 79.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 3 / 10 | 72.5 ns | 68.1 ns - 87.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 4 / 10 | 76.7 ns | 65.2 ns - 84.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 129.7 ns | 121.3 ns - 135.2 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 157.2 ns | 154.6 ns - 172.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 7 / 10 | 370.8 ns | 357.8 ns - 408.3 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 8 / 10 | 486.5 ns | 449.8 ns - 514.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 831.2 ns | 788.4 ns - 945.4 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 1.29 us | 1.25 us - 1.35 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 567.5 ns | 525.7 ns - 580.1 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 2 / 8 | 605.6 ns | 551.7 ns - 636.7 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 3 / 8 | 1.34 us | 1.32 us - 1.38 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 4 / 8 | 2.08 us | 2.05 us - 2.24 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 5 / 8 | 2.67 us | 2.43 us - 2.72 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 6 / 8 | 95.50 us | 92.00 us - 98.60 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 7 / 8 | 139.20 us | 133.70 us - 144.70 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 368.40 us | 364.10 us - 381.20 us |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 1 / 10 | 75.2 ns | 71.7 ns - 85.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 2 / 10 | 90.5 ns | 76.6 ns - 92.3 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 3 / 10 | 116.7 ns | 110.6 ns - 129.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 120.2 ns | 119.2 ns - 135.0 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 138.7 ns | 129.2 ns - 144.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 181.7 ns | 174.1 ns - 185.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 7 / 10 | 432.0 ns | 405.7 ns - 561.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 606.8 ns | 568.3 ns - 641.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 1.27 us | 1.22 us - 1.36 us |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 1.52 us | 1.50 us - 1.55 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 1 / 8 | 657.5 ns | 645.9 ns - 676.7 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 2 / 8 | 804.1 ns | 784.7 ns - 819.6 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 3 / 8 | 1.66 us | 1.59 us - 15.70 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 4 / 8 | 2.44 us | 2.32 us - 2.48 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 2.65 us | 2.59 us - 2.89 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 6 / 8 | 98.20 us | 92.50 us - 99.70 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 7 / 8 | 154.10 us | 150.30 us - 158.10 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 407.80 us | 393.00 us - 432.10 us |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 1 / 10 | 55.3 ns | 50.2 ns - 59.0 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 2 / 10 | 57.7 ns | 51.0 ns - 70.4 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 65.0 ns | 61.8 ns - 79.9 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 111.9 ns | 101.0 ns - 113.5 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify | 5 / 10 | 156.4 ns | 134.1 ns - 168.0 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 6 / 10 | 240.3 ns | 234.5 ns - 242.8 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 7 / 10 | 392.8 ns | 371.4 ns - 403.4 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | awilix | 8 / 10 | 409.4 ns | 395.5 ns - 431.2 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typedi | 9 / 10 | 428.1 ns | 413.9 ns - 471.5 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 1.09 us | 1.02 us - 1.14 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 1 / 8 | 670.8 ns | 657.2 ns - 685.1 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 684.2 ns | 670.4 ns - 691.2 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 3 / 8 | 1.02 us | 997.1 ns - 1.05 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | awilix | 4 / 8 | 2.06 us | 2.01 us - 2.12 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 2.40 us | 2.38 us - 2.49 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify | 6 / 8 | 93.50 us | 92.00 us - 97.40 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 7 / 8 | 140.90 us | 131.20 us - 145.90 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 416.90 us | 382.70 us - 435.60 us |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 1 / 10 | 129.5 ns | 119.1 ns - 142.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 2 / 10 | 131.1 ns | 117.8 ns - 138.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 3 / 10 | 179.7 ns | 177.7 ns - 199.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 4 / 10 | 184.0 ns | 170.8 ns - 197.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 5 / 10 | 189.8 ns | 179.2 ns - 196.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 231.5 ns | 225.3 ns - 242.3 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 7 / 10 | 665.7 ns | 661.6 ns - 753.4 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 8 / 10 | 912.3 ns | 884.2 ns - 1.08 us |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 1.25 us | 1.11 us - 1.37 us |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 2.57 us | 2.49 us - 2.58 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 681.2 ns | 677.3 ns - 705.3 ns |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 2 / 8 | 1.28 us | 1.25 us - 1.33 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 3 / 8 | 3.84 us | 3.74 us - 3.86 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 4 / 8 | 4.22 us | 3.62 us - 4.32 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 5 / 8 | 16.00 us | 2.68 us - 17.30 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 6 / 8 | 97.70 us | 92.00 us - 117.40 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 7 / 8 | 201.50 us | 197.60 us - 202.90 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 497.10 us | 487.60 us - 506.50 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 374.9 ns | 372.4 ns - 454.6 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 378.8 ns | 366.8 ns - 430.0 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 413.2 ns | 409.6 ns - 419.7 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 4 / 10 | 913.8 ns | 883.8 ns - 994.9 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 5 / 10 | 968.0 ns | 932.9 ns - 975.4 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 1.00 us | 996.5 ns - 1.02 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 7 / 10 | 2.53 us | 2.48 us - 2.68 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 8 / 10 | 2.69 us | 2.63 us - 2.89 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 9 / 10 | 3.84 us | 3.68 us - 3.94 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 30.50 us | 8.51 us - 31.20 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 3.35 us | 3.17 us - 3.36 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 2 / 8 | 5.76 us | 5.54 us - 18.00 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 3 / 8 | 12.41 us | 11.92 us - 12.53 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 4 / 8 | 30.00 us | 29.00 us - 33.00 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 5 / 8 | 39.80 us | 10.96 us - 41.70 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 6 / 8 | 159.00 us | 154.90 us - 160.00 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 7 / 8 | 428.70 us | 419.40 us - 433.30 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 1.13 ms | 1.11 ms - 1.20 ms |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify | 1 / 10 | 177.4 ns | 170.7 ns - 181.6 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 181.4 ns | 174.1 ns - 198.9 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 3 / 10 | 184.4 ns | 172.7 ns - 200.6 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typedi | 4 / 10 | 185.7 ns | 179.2 ns - 187.2 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 5 / 10 | 220.2 ns | 219.0 ns - 228.3 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 6 / 10 | 220.3 ns | 212.0 ns - 227.0 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 7 / 10 | 226.7 ns | 219.0 ns - 235.7 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 8 / 10 | 248.8 ns | 237.3 ns - 267.5 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 629.8 ns | 590.8 ns - 644.0 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 1.19 us | 1.12 us - 1.22 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 537.1 ns | 514.8 ns - 564.2 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 2 / 10 | 545.0 ns | 534.6 ns - 579.0 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 611.4 ns | 595.1 ns - 625.5 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 4 / 10 | 746.0 ns | 688.7 ns - 871.4 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 5 / 10 | 1.01 us | 965.1 ns - 1.07 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 1.06 us | 1.04 us - 1.12 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 1.36 us | 1.34 us - 1.42 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 8 / 10 | 1.78 us | 1.76 us - 1.87 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 9 / 10 | 2.45 us | 2.40 us - 2.46 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 3.13 us | 3.11 us - 3.25 us |

## Memory Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Allocations |
| --- | --- | --- | --- | ---: | ---: |
| Node.js | complete | `registrationClass` | typed-inject | 1 / 9 | 283.42 KB |
| Node.js | complete | `registrationClass` | typedi | 2 / 9 | 433.33 KB |
| Node.js | complete | `registrationClass` | tsyringe | 3 / 9 | 462.93 KB |
| Node.js | complete | `registrationClass` | needle-di | 4 / 9 | 559.34 KB |
| Node.js | complete | `registrationClass` | scope-di-codegen | 5 / 9 | 560.68 KB |
| Node.js | complete | `registrationClass` | scope-di | 6 / 9 | 561.37 KB |
| Node.js | complete | `registrationClass` | awilix | 7 / 9 | 1.36 MB |
| Node.js | complete | `registrationClass` | inversify | 8 / 9 | 3.53 MB |
| Node.js | complete | `registrationClass` | inversify-jit | 9 / 9 | 3.53 MB |
| Node.js | complete | `registrationValue` | typedi | 1 / 9 | 123.40 KB |
| Node.js | complete | `registrationValue` | tsyringe | 2 / 9 | 135.30 KB |
| Node.js | complete | `registrationValue` | needle-di | 3 / 9 | 135.94 KB |
| Node.js | complete | `registrationValue` | typed-inject | 4 / 9 | 139.38 KB |
| Node.js | complete | `registrationValue` | awilix | 5 / 9 | 301.79 KB |
| Node.js | complete | `registrationValue` | scope-di-codegen | 6 / 9 | 407.94 KB |
| Node.js | complete | `registrationValue` | scope-di | 7 / 9 | 408.63 KB |
| Node.js | complete | `registrationValue` | inversify-jit | 8 / 9 | 3.12 MB |
| Node.js | complete | `registrationValue` | inversify | 9 / 9 | 3.12 MB |
| Node.js | complete | `registrationFactory` | typed-inject | 1 / 9 | 139.84 KB |
| Node.js | complete | `registrationFactory` | tsyringe | 2 / 9 | 166.27 KB |
| Node.js | complete | `registrationFactory` | typedi | 3 / 9 | 194.34 KB |
| Node.js | complete | `registrationFactory` | needle-di | 4 / 9 | 219.46 KB |
| Node.js | complete | `registrationFactory` | scope-di-codegen | 5 / 9 | 409.96 KB |
| Node.js | complete | `registrationFactory` | scope-di | 6 / 9 | 410.64 KB |
| Node.js | complete | `registrationFactory` | awilix | 7 / 9 | 1.10 MB |
| Node.js | complete | `registrationFactory` | inversify-jit | 8 / 9 | 3.20 MB |
| Node.js | complete | `registrationFactory` | inversify | 9 / 9 | 3.21 MB |
| Node.js | complete | `warmResolveValue` | typed-inject | 1 / 11 | 1 B |
| Node.js | complete | `warmResolveValue` | scope-di | 2 / 11 | 3 B |
| Node.js | complete | `warmResolveValue` | scope-di-codegen | 3 / 11 | 3 B |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload-codegen | 4 / 11 | 3 B |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload | 5 / 11 | 3 B |
| Node.js | complete | `warmResolveValue` | needle-di | 6 / 11 | 7 B |
| Node.js | complete | `warmResolveValue` | typedi | 7 / 11 | 13 B |
| Node.js | complete | `warmResolveValue` | inversify-jit | 8 / 11 | 50 B |
| Node.js | complete | `warmResolveValue` | inversify | 9 / 11 | 53 B |
| Node.js | complete | `warmResolveValue` | awilix | 10 / 11 | 100 B |
| Node.js | complete | `warmResolveValue` | tsyringe | 11 / 11 | 237 B |
| Node.js | complete | `coldResolveValue` | typed-inject | 1 / 9 | 1 B |
| Node.js | complete | `coldResolveValue` | typedi | 2 / 9 | 20 B |
| Node.js | complete | `coldResolveValue` | scope-di | 3 / 9 | 68 B |
| Node.js | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 75 B |
| Node.js | complete | `coldResolveValue` | awilix | 5 / 9 | 253 B |
| Node.js | complete | `coldResolveValue` | tsyringe | 6 / 9 | 257 B |
| Node.js | complete | `coldResolveValue` | needle-di | 7 / 9 | 592 B |
| Node.js | complete | `coldResolveValue` | inversify-jit | 8 / 9 | 5.78 KB |
| Node.js | complete | `coldResolveValue` | inversify | 9 / 9 | 5.85 KB |
| Node.js | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 1 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 2 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di | 3 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload | 4 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-codegen | 5 / 11 | 4 B |
| Node.js | complete | `warmResolveSingletonClass` | inversify | 6 / 11 | 5 B |
| Node.js | complete | `warmResolveSingletonClass` | needle-di | 7 / 11 | 6 B |
| Node.js | complete | `warmResolveSingletonClass` | inversify-jit | 8 / 11 | 8 B |
| Node.js | complete | `warmResolveSingletonClass` | typedi | 9 / 11 | 15 B |
| Node.js | complete | `warmResolveSingletonClass` | awilix | 10 / 11 | 61 B |
| Node.js | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 229 B |
| Node.js | complete | `coldResolveSingletonClass` | scope-di | 1 / 9 | 99 B |
| Node.js | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 111 B |
| Node.js | complete | `coldResolveSingletonClass` | typed-inject | 3 / 9 | 153 B |
| Node.js | complete | `coldResolveSingletonClass` | awilix | 4 / 9 | 324 B |
| Node.js | complete | `coldResolveSingletonClass` | typedi | 5 / 9 | 343 B |
| Node.js | complete | `coldResolveSingletonClass` | tsyringe | 6 / 9 | 392 B |
| Node.js | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 582 B |
| Node.js | complete | `coldResolveSingletonClass` | inversify | 8 / 9 | 8.43 KB |
| Node.js | complete | `coldResolveSingletonClass` | inversify-jit | 9 / 9 | 8.78 KB |
| Node.js | complete | `warmResolveTransientClass` | scope-di | 1 / 10 | 27 B |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 2 / 10 | 27 B |
| Node.js | complete | `warmResolveTransientClass` | scope-di-codegen | 3 / 10 | 27 B |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload | 4 / 10 | 28 B |
| Node.js | complete | `warmResolveTransientClass` | inversify | 5 / 10 | 29 B |
| Node.js | complete | `warmResolveTransientClass` | inversify-jit | 6 / 10 | 30 B |
| Node.js | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 116 B |
| Node.js | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 126 B |
| Node.js | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 375 B |
| Node.js | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 521 B |
| Node.js | complete | `coldResolveTransientClass` | scope-di | 1 / 8 | 53 B |
| Node.js | complete | `coldResolveTransientClass` | typed-inject | 2 / 8 | 118 B |
| Node.js | complete | `coldResolveTransientClass` | awilix | 3 / 8 | 286 B |
| Node.js | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 326 B |
| Node.js | complete | `coldResolveTransientClass` | typedi | 5 / 8 | 455 B |
| Node.js | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 572 B |
| Node.js | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 8.47 KB |
| Node.js | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 12.74 KB |
| Node.js | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 1 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di | 2 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 3 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 4 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-codegen | 5 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonFactory` | inversify | 6 / 11 | 5 B |
| Node.js | complete | `warmResolveSingletonFactory` | needle-di | 7 / 11 | 7 B |
| Node.js | complete | `warmResolveSingletonFactory` | inversify-jit | 8 / 11 | 9 B |
| Node.js | complete | `warmResolveSingletonFactory` | typedi | 9 / 11 | 14 B |
| Node.js | complete | `warmResolveSingletonFactory` | awilix | 10 / 11 | 61 B |
| Node.js | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 231 B |
| Node.js | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 17 B |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di | 2 / 9 | 78 B |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 88 B |
| Node.js | complete | `coldResolveSingletonFactory` | typed-inject | 4 / 9 | 129 B |
| Node.js | complete | `coldResolveSingletonFactory` | tsyringe | 5 / 9 | 230 B |
| Node.js | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 300 B |
| Node.js | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 724 B |
| Node.js | complete | `coldResolveSingletonFactory` | inversify | 8 / 9 | 6.87 KB |
| Node.js | complete | `coldResolveSingletonFactory` | inversify-jit | 9 / 9 | 8.14 KB |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 1 / 10 | 46 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 2 / 10 | 55 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 3 / 10 | 56 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 4 / 10 | 56 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 5 / 10 | 57 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 6 / 10 | 91 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 7 / 10 | 91 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 8 / 10 | 131 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 9 / 10 | 141 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 272 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-codegen | 1 / 10 | 59 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 2 / 10 | 60 B |
| Node.js | complete | `warmResolveTransientFactory` | inversify-jit | 3 / 10 | 60 B |
| Node.js | complete | `warmResolveTransientFactory` | inversify | 4 / 10 | 60 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di | 5 / 10 | 60 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload | 6 / 10 | 60 B |
| Node.js | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 73 B |
| Node.js | complete | `warmResolveTransientFactory` | typed-inject | 8 / 10 | 148 B |
| Node.js | complete | `warmResolveTransientFactory` | awilix | 9 / 10 | 156 B |
| Node.js | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 286 B |
| Node.js | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 73 B |
| Node.js | complete | `coldResolveTransientFactory` | scope-di | 2 / 8 | 91 B |
| Node.js | complete | `coldResolveTransientFactory` | typed-inject | 3 / 8 | 149 B |
| Node.js | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 316 B |
| Node.js | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 337 B |
| Node.js | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 603 B |
| Node.js | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 7.57 KB |
| Node.js | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 11.36 KB |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 1 / 10 | 91 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 2 / 10 | 91 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di | 3 / 10 | 92 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 4 / 10 | 92 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | typedi | 5 / 10 | 135 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify-jit | 6 / 10 | 139 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify | 7 / 10 | 144 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | awilix | 8 / 10 | 370 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | typed-inject | 9 / 10 | 596 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 781 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 123 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di | 2 / 8 | 201 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | awilix | 3 / 8 | 562 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | typed-inject | 4 / 8 | 604 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 1.05 KB |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 1.25 KB |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 17.19 KB |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 28.87 KB |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 1 / 10 | 205 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 2 / 10 | 213 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 3 / 10 | 213 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 4 / 10 | 216 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 443 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 472 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 7 / 10 | 760 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 8 / 10 | 1.28 KB |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 2.09 KB |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 2.37 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 308 B |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 2 / 8 | 944 B |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 3 / 8 | 1.27 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 4 / 8 | 2.38 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 5 / 8 | 2.97 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 6 / 8 | 9.46 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 40.67 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 74.19 KB |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 1 / 10 | 247 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 2 / 10 | 249 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 3 / 10 | 430 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 4 / 10 | 444 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 464 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 513 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 7 / 10 | 889 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 8 / 10 | 1.49 KB |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 2.44 KB |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 2.84 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 466 B |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 2 / 8 | 1.05 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 3 / 8 | 1.50 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 4 / 8 | 2.86 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 3.39 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 6 / 8 | 7.70 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 43.78 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 74.45 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 1 / 10 | 200 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 2 / 10 | 200 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 211 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 276 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 5 / 10 | 282 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify | 6 / 10 | 309 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typedi | 7 / 10 | 637 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | awilix | 8 / 10 | 760 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 9 / 10 | 1.21 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 1.63 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 351 B |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 673 B |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | awilix | 3 / 8 | 949 B |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 4 / 8 | 1.19 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 2.65 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 7.06 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 40.95 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 67.05 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 1 / 10 | 359 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 2 / 10 | 370 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 3 / 10 | 562 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 4 / 10 | 564 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 5 / 10 | 572 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 739 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 7 / 10 | 1.40 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 8 / 10 | 2.34 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 3.89 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 4.69 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 680 B |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 2 / 8 | 1.40 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 3 / 8 | 2.36 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 4 / 8 | 6.14 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 5 / 8 | 9.58 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 6 / 8 | 12.97 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 7 / 8 | 62.54 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 105.27 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 1 / 10 | 985 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 985 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 3 / 10 | 986 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 4 / 10 | 986 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 5 / 10 | 2.14 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 6 / 10 | 2.32 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 7 / 10 | 2.53 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 8 / 10 | 3.97 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 9 / 10 | 6.58 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 21.51 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 938 B |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 2 / 8 | 4.26 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 3 / 8 | 6.50 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 4 / 8 | 18.65 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 5 / 8 | 21.59 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 6 / 8 | 27.00 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 7 / 8 | 156.80 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 290.19 KB |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 200 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 201 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typedi | 3 / 10 | 214 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 4 / 10 | 328 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 5 / 10 | 330 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify | 6 / 10 | 330 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 7 / 10 | 338 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 8 / 10 | 486 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 763 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 2.49 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 388 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 2 / 10 | 388 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 3 / 10 | 389 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 4 / 10 | 390 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 5 / 10 | 426 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 1.54 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 1.58 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 8 / 10 | 1.93 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 9 / 10 | 2.37 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 7.09 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Node.js | v26.11.1 | Boni / AMD Ryzen 7 3800X 8-Core Processor / win32 10.0.22631 x64 | complete | 300 | [`bench_node_json_complete.json`](./bench_node_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | 7de000ef198459b0a478103290b40a43dc266e0e |
| Branch | chore/benchmarks |
