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
| Node.js | complete | `registrationClass` | typed-inject | 1 / 9 | 171.10 us | 169.80 us - 173.70 us |
| Node.js | complete | `registrationClass` | tsyringe | 2 / 9 | 189.80 us | 184.10 us - 193.00 us |
| Node.js | complete | `registrationClass` | scope-di | 3 / 9 | 222.00 us | 213.30 us - 229.70 us |
| Node.js | complete | `registrationClass` | scope-di-codegen | 4 / 9 | 234.40 us | 227.70 us - 294.10 us |
| Node.js | complete | `registrationClass` | needle-di | 5 / 9 | 313.00 us | 312.60 us - 340.30 us |
| Node.js | complete | `registrationClass` | typedi | 6 / 9 | 342.90 us | 340.70 us - 350.10 us |
| Node.js | complete | `registrationClass` | awilix | 7 / 9 | 771.40 us | 769.20 us - 786.80 us |
| Node.js | complete | `registrationClass` | inversify-jit | 8 / 9 | 1.77 ms | 1.74 ms - 1.79 ms |
| Node.js | complete | `registrationClass` | inversify | 9 / 9 | 1.78 ms | 1.75 ms - 1.85 ms |
| Node.js | complete | `registrationValue` | tsyringe | 1 / 9 | 18.70 us | 17.40 us - 20.20 us |
| Node.js | complete | `registrationValue` | needle-di | 2 / 9 | 85.30 us | 82.30 us - 87.70 us |
| Node.js | complete | `registrationValue` | typed-inject | 3 / 9 | 93.60 us | 93.30 us - 95.80 us |
| Node.js | complete | `registrationValue` | typedi | 4 / 9 | 122.40 us | 122.10 us - 124.10 us |
| Node.js | complete | `registrationValue` | scope-di-codegen | 5 / 9 | 159.90 us | 158.00 us - 176.40 us |
| Node.js | complete | `registrationValue` | scope-di | 6 / 9 | 163.20 us | 156.30 us - 168.50 us |
| Node.js | complete | `registrationValue` | awilix | 7 / 9 | 273.80 us | 265.60 us - 285.90 us |
| Node.js | complete | `registrationValue` | inversify-jit | 8 / 9 | 1.49 ms | 1.49 ms - 1.55 ms |
| Node.js | complete | `registrationValue` | inversify | 9 / 9 | 1.50 ms | 1.47 ms - 1.52 ms |
| Node.js | complete | `registrationFactory` | tsyringe | 1 / 9 | 21.40 us | 18.50 us - 23.00 us |
| Node.js | complete | `registrationFactory` | typed-inject | 2 / 9 | 97.80 us | 93.50 us - 101.00 us |
| Node.js | complete | `registrationFactory` | scope-di | 3 / 9 | 153.10 us | 146.20 us - 157.10 us |
| Node.js | complete | `registrationFactory` | scope-di-codegen | 4 / 9 | 165.00 us | 154.40 us - 168.70 us |
| Node.js | complete | `registrationFactory` | needle-di | 5 / 9 | 169.10 us | 168.10 us - 173.20 us |
| Node.js | complete | `registrationFactory` | typedi | 6 / 9 | 228.80 us | 178.50 us - 230.70 us |
| Node.js | complete | `registrationFactory` | awilix | 7 / 9 | 421.20 us | 396.00 us - 438.90 us |
| Node.js | complete | `registrationFactory` | inversify | 8 / 9 | 1.57 ms | 1.57 ms - 1.61 ms |
| Node.js | complete | `registrationFactory` | inversify-jit | 9 / 9 | 1.57 ms | 1.55 ms - 1.61 ms |
| Node.js | complete | `warmResolveValue` | typed-inject | 1 / 11 | 0.5 ns | 0.5 ns - 0.5 ns |
| Node.js | complete | `warmResolveValue` | typedi | 2 / 11 | 6.8 ns | 6.8 ns - 7.2 ns |
| Node.js | complete | `warmResolveValue` | inversify | 3 / 11 | 9.6 ns | 9.0 ns - 10.7 ns |
| Node.js | complete | `warmResolveValue` | inversify-jit | 4 / 11 | 10.2 ns | 8.6 ns - 10.5 ns |
| Node.js | complete | `warmResolveValue` | awilix | 5 / 11 | 11.8 ns | 10.6 ns - 12.0 ns |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload | 6 / 11 | 12.1 ns | 12.0 ns - 12.2 ns |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload-codegen | 7 / 11 | 12.2 ns | 12.1 ns - 12.4 ns |
| Node.js | complete | `warmResolveValue` | scope-di-codegen | 8 / 11 | 12.3 ns | 12.1 ns - 12.4 ns |
| Node.js | complete | `warmResolveValue` | scope-di | 9 / 11 | 12.3 ns | 12.2 ns - 12.5 ns |
| Node.js | complete | `warmResolveValue` | needle-di | 10 / 11 | 18.7 ns | 18.6 ns - 19.3 ns |
| Node.js | complete | `warmResolveValue` | tsyringe | 11 / 11 | 77.2 ns | 55.6 ns - 95.0 ns |
| Node.js | complete | `coldResolveValue` | typed-inject | 1 / 9 | 4.7 ns | 4.6 ns - 5.5 ns |
| Node.js | complete | `coldResolveValue` | typedi | 2 / 9 | 18.0 ns | 14.9 ns - 19.2 ns |
| Node.js | complete | `coldResolveValue` | scope-di-codegen | 3 / 9 | 43.0 ns | 41.2 ns - 44.5 ns |
| Node.js | complete | `coldResolveValue` | scope-di | 4 / 9 | 43.1 ns | 42.3 ns - 45.0 ns |
| Node.js | complete | `coldResolveValue` | awilix | 5 / 9 | 82.1 ns | 80.5 ns - 84.5 ns |
| Node.js | complete | `coldResolveValue` | tsyringe | 6 / 9 | 159.3 ns | 150.9 ns - 163.6 ns |
| Node.js | complete | `coldResolveValue` | needle-di | 7 / 9 | 402.5 ns | 381.8 ns - 406.3 ns |
| Node.js | complete | `coldResolveValue` | inversify-jit | 8 / 9 | 29.60 us | 28.90 us - 33.00 us |
| Node.js | complete | `coldResolveValue` | inversify | 9 / 9 | 30.80 us | 28.50 us - 34.40 us |
| Node.js | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 0.5 ns | 0.5 ns - 0.6 ns |
| Node.js | complete | `warmResolveSingletonClass` | typedi | 2 / 11 | 6.8 ns | 6.8 ns - 7.2 ns |
| Node.js | complete | `warmResolveSingletonClass` | inversify-jit | 3 / 11 | 8.3 ns | 8.3 ns - 8.3 ns |
| Node.js | complete | `warmResolveSingletonClass` | inversify | 4 / 11 | 8.3 ns | 8.3 ns - 8.3 ns |
| Node.js | complete | `warmResolveSingletonClass` | awilix | 5 / 11 | 9.9 ns | 8.5 ns - 10.5 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di | 6 / 11 | 12.2 ns | 12.1 ns - 12.3 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload | 7 / 11 | 12.2 ns | 12.0 ns - 12.4 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 8 / 11 | 12.2 ns | 12.1 ns - 12.3 ns |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-codegen | 9 / 11 | 12.3 ns | 12.2 ns - 12.5 ns |
| Node.js | complete | `warmResolveSingletonClass` | needle-di | 10 / 11 | 18.7 ns | 18.5 ns - 19.4 ns |
| Node.js | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 91.0 ns | 57.3 ns - 96.4 ns |
| Node.js | complete | `coldResolveSingletonClass` | typed-inject | 1 / 9 | 37.4 ns | 36.9 ns - 37.7 ns |
| Node.js | complete | `coldResolveSingletonClass` | scope-di-codegen | 2 / 9 | 59.1 ns | 56.4 ns - 59.4 ns |
| Node.js | complete | `coldResolveSingletonClass` | scope-di | 3 / 9 | 60.0 ns | 56.9 ns - 65.3 ns |
| Node.js | complete | `coldResolveSingletonClass` | typedi | 4 / 9 | 147.6 ns | 143.0 ns - 150.0 ns |
| Node.js | complete | `coldResolveSingletonClass` | tsyringe | 5 / 9 | 182.6 ns | 149.2 ns - 205.5 ns |
| Node.js | complete | `coldResolveSingletonClass` | awilix | 6 / 9 | 185.6 ns | 172.9 ns - 191.3 ns |
| Node.js | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 402.2 ns | 398.4 ns - 406.6 ns |
| Node.js | complete | `coldResolveSingletonClass` | inversify | 8 / 9 | 38.50 us | 37.00 us - 42.00 us |
| Node.js | complete | `coldResolveSingletonClass` | inversify-jit | 9 / 9 | 39.90 us | 37.60 us - 40.40 us |
| Node.js | complete | `warmResolveTransientClass` | scope-di | 1 / 10 | 8.2 ns | 8.0 ns - 9.0 ns |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload | 2 / 10 | 8.8 ns | 7.7 ns - 9.3 ns |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 3 / 10 | 9.0 ns | 7.7 ns - 10.0 ns |
| Node.js | complete | `warmResolveTransientClass` | scope-di-codegen | 4 / 10 | 9.1 ns | 8.2 ns - 9.5 ns |
| Node.js | complete | `warmResolveTransientClass` | inversify-jit | 5 / 10 | 10.6 ns | 9.9 ns - 10.9 ns |
| Node.js | complete | `warmResolveTransientClass` | inversify | 6 / 10 | 11.0 ns | 10.5 ns - 12.0 ns |
| Node.js | complete | `warmResolveTransientClass` | awilix | 7 / 10 | 15.9 ns | 15.6 ns - 15.9 ns |
| Node.js | complete | `warmResolveTransientClass` | typed-inject | 8 / 10 | 17.0 ns | 16.4 ns - 17.6 ns |
| Node.js | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 74.8 ns | 72.0 ns - 109.8 ns |
| Node.js | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 135.1 ns | 132.2 ns - 137.6 ns |
| Node.js | complete | `coldResolveTransientClass` | typed-inject | 1 / 8 | 17.1 ns | 16.8 ns - 17.4 ns |
| Node.js | complete | `coldResolveTransientClass` | scope-di | 2 / 8 | 28.8 ns | 27.2 ns - 29.4 ns |
| Node.js | complete | `coldResolveTransientClass` | typedi | 3 / 8 | 137.3 ns | 131.3 ns - 143.0 ns |
| Node.js | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 168.6 ns | 143.9 ns - 170.1 ns |
| Node.js | complete | `coldResolveTransientClass` | awilix | 5 / 8 | 170.9 ns | 159.4 ns - 185.4 ns |
| Node.js | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 6.25 us | 6.04 us - 6.60 us |
| Node.js | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 37.50 us | 36.60 us - 40.20 us |
| Node.js | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 92.50 us | 91.10 us - 117.90 us |
| Node.js | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 0.5 ns | 0.5 ns - 0.5 ns |
| Node.js | complete | `warmResolveSingletonFactory` | typedi | 2 / 11 | 6.8 ns | 6.8 ns - 7.0 ns |
| Node.js | complete | `warmResolveSingletonFactory` | inversify-jit | 3 / 11 | 8.3 ns | 8.3 ns - 8.3 ns |
| Node.js | complete | `warmResolveSingletonFactory` | inversify | 4 / 11 | 8.3 ns | 8.3 ns - 8.5 ns |
| Node.js | complete | `warmResolveSingletonFactory` | awilix | 5 / 11 | 9.5 ns | 8.9 ns - 10.5 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di | 6 / 11 | 12.1 ns | 12.0 ns - 12.3 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 7 / 11 | 12.1 ns | 12.1 ns - 12.8 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 8 / 11 | 12.1 ns | 12.0 ns - 12.5 ns |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-codegen | 9 / 11 | 12.2 ns | 12.0 ns - 12.3 ns |
| Node.js | complete | `warmResolveSingletonFactory` | needle-di | 10 / 11 | 18.6 ns | 18.4 ns - 19.1 ns |
| Node.js | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 57.9 ns | 56.4 ns - 94.8 ns |
| Node.js | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 20.5 ns | 20.3 ns - 21.0 ns |
| Node.js | complete | `coldResolveSingletonFactory` | typed-inject | 2 / 9 | 29.5 ns | 28.6 ns - 31.3 ns |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 43.2 ns | 40.3 ns - 47.1 ns |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di | 4 / 9 | 44.1 ns | 41.6 ns - 45.0 ns |
| Node.js | complete | `coldResolveSingletonFactory` | tsyringe | 5 / 9 | 160.8 ns | 126.9 ns - 168.3 ns |
| Node.js | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 171.4 ns | 168.6 ns - 179.3 ns |
| Node.js | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 401.7 ns | 399.0 ns - 404.2 ns |
| Node.js | complete | `coldResolveSingletonFactory` | inversify-jit | 8 / 9 | 34.90 us | 34.80 us - 36.00 us |
| Node.js | complete | `coldResolveSingletonFactory` | inversify | 9 / 9 | 35.80 us | 35.30 us - 40.20 us |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 1 / 10 | 15.0 ns | 14.3 ns - 16.2 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 2 / 10 | 17.0 ns | 15.1 ns - 17.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 3 / 10 | 17.3 ns | 17.0 ns - 18.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 4 / 10 | 17.5 ns | 16.8 ns - 19.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 5 / 10 | 20.8 ns | 19.6 ns - 21.0 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 6 / 10 | 23.5 ns | 22.5 ns - 24.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 7 / 10 | 23.7 ns | 23.1 ns - 23.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 8 / 10 | 24.2 ns | 23.7 ns - 24.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 9 / 10 | 25.0 ns | 23.5 ns - 25.4 ns |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 64.7 ns | 62.4 ns - 104.5 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 1 / 10 | 8.4 ns | 8.2 ns - 10.5 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload | 2 / 10 | 8.6 ns | 8.4 ns - 10.0 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-codegen | 3 / 10 | 9.1 ns | 8.4 ns - 9.9 ns |
| Node.js | complete | `warmResolveTransientFactory` | scope-di | 4 / 10 | 9.9 ns | 8.3 ns - 10.1 ns |
| Node.js | complete | `warmResolveTransientFactory` | inversify | 5 / 10 | 11.7 ns | 9.8 ns - 12.1 ns |
| Node.js | complete | `warmResolveTransientFactory` | inversify-jit | 6 / 10 | 11.8 ns | 11.0 ns - 12.3 ns |
| Node.js | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 13.8 ns | 13.1 ns - 14.8 ns |
| Node.js | complete | `warmResolveTransientFactory` | typed-inject | 8 / 10 | 15.2 ns | 14.0 ns - 16.1 ns |
| Node.js | complete | `warmResolveTransientFactory` | awilix | 9 / 10 | 15.7 ns | 14.6 ns - 16.7 ns |
| Node.js | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 60.4 ns | 59.1 ns - 95.8 ns |
| Node.js | complete | `coldResolveTransientFactory` | typed-inject | 1 / 8 | 16.4 ns | 16.2 ns - 16.6 ns |
| Node.js | complete | `coldResolveTransientFactory` | typedi | 2 / 8 | 19.4 ns | 19.3 ns - 19.5 ns |
| Node.js | complete | `coldResolveTransientFactory` | scope-di | 3 / 8 | 31.1 ns | 30.4 ns - 33.2 ns |
| Node.js | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 154.8 ns | 150.8 ns - 160.8 ns |
| Node.js | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 158.2 ns | 126.2 ns - 159.4 ns |
| Node.js | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 6.27 us | 6.16 us - 6.65 us |
| Node.js | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 35.70 us | 34.50 us - 39.80 us |
| Node.js | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 93.60 us | 88.70 us - 98.90 us |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 1 / 10 | 20.4 ns | 19.8 ns - 21.5 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 2 / 10 | 21.3 ns | 19.8 ns - 21.3 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 3 / 10 | 21.6 ns | 21.0 ns - 23.3 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify-jit | 4 / 10 | 31.8 ns | 29.8 ns - 32.3 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di | 5 / 10 | 37.9 ns | 36.4 ns - 38.4 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | typedi | 6 / 10 | 41.5 ns | 41.2 ns - 42.3 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify | 7 / 10 | 45.3 ns | 45.0 ns - 46.4 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | typed-inject | 8 / 10 | 70.2 ns | 69.1 ns - 74.4 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | awilix | 9 / 10 | 91.5 ns | 88.2 ns - 92.4 ns |
| Node.js | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 212.6 ns | 155.0 ns - 261.1 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 56.8 ns | 56.1 ns - 58.2 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | typed-inject | 2 / 8 | 70.8 ns | 69.8 ns - 73.2 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di | 3 / 8 | 120.2 ns | 109.7 ns - 125.4 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | awilix | 4 / 8 | 331.6 ns | 325.9 ns - 338.8 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 373.0 ns | 354.9 ns - 412.5 ns |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 20.67 us | 20.35 us - 20.94 us |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 44.10 us | 41.00 us - 64.20 us |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 168.00 us | 161.90 us - 181.30 us |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 1 / 10 | 34.1 ns | 32.6 ns - 47.4 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 2 / 10 | 34.9 ns | 32.6 ns - 35.4 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 3 / 10 | 37.5 ns | 36.7 ns - 37.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 4 / 10 | 39.7 ns | 39.1 ns - 40.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 63.4 ns | 62.5 ns - 63.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 76.6 ns | 75.9 ns - 76.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 7 / 10 | 177.1 ns | 175.4 ns - 183.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 8 / 10 | 221.0 ns | 218.0 ns - 225.1 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 446.7 ns | 441.3 ns - 546.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 644.5 ns | 631.3 ns - 662.3 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 161.3 ns | 157.9 ns - 174.1 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 2 / 8 | 188.2 ns | 184.6 ns - 190.6 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 3 / 8 | 653.1 ns | 646.9 ns - 656.0 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 4 / 8 | 796.8 ns | 768.5 ns - 905.5 ns |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 5 / 8 | 916.9 ns | 903.8 ns - 1.08 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 6 / 8 | 42.60 us | 40.92 us - 43.74 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 53.50 us | 50.90 us - 59.40 us |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 219.30 us | 212.90 us - 235.60 us |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 1 / 10 | 41.8 ns | 40.4 ns - 42.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 2 / 10 | 42.7 ns | 42.3 ns - 43.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 3 / 10 | 60.8 ns | 59.6 ns - 61.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 65.7 ns | 64.8 ns - 67.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 73.1 ns | 71.9 ns - 74.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 81.5 ns | 81.0 ns - 82.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 7 / 10 | 202.0 ns | 197.0 ns - 206.2 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 8 / 10 | 261.0 ns | 259.0 ns - 264.4 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 509.3 ns | 446.3 ns - 525.3 ns |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 758.5 ns | 753.4 ns - 769.5 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 228.4 ns | 219.7 ns - 240.5 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 2 / 8 | 231.2 ns | 226.3 ns - 241.2 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 3 / 8 | 778.7 ns | 761.3 ns - 788.5 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 4 / 8 | 885.8 ns | 853.2 ns - 889.6 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 959.4 ns | 947.2 ns - 996.8 ns |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 6 / 8 | 49.48 us | 48.93 us - 92.40 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 52.10 us | 50.60 us - 55.40 us |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 242.90 us | 231.60 us - 247.50 us |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 1 / 10 | 32.6 ns | 31.1 ns - 32.9 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 2 / 10 | 32.6 ns | 32.1 ns - 32.8 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 3 / 10 | 35.8 ns | 35.4 ns - 36.0 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 59.8 ns | 58.1 ns - 60.9 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify | 5 / 10 | 97.7 ns | 94.5 ns - 99.2 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 6 / 10 | 131.6 ns | 129.8 ns - 133.1 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 7 / 10 | 195.3 ns | 186.7 ns - 202.5 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typedi | 8 / 10 | 266.8 ns | 250.1 ns - 269.5 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | awilix | 9 / 10 | 267.4 ns | 259.9 ns - 271.7 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 337.1 ns | 315.8 ns - 461.2 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 1 / 8 | 207.4 ns | 203.5 ns - 218.3 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 290.2 ns | 279.6 ns - 295.4 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 3 / 8 | 337.3 ns | 328.7 ns - 349.5 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | awilix | 4 / 8 | 843.0 ns | 817.6 ns - 878.6 ns |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 1.02 us | 951.5 ns - 1.05 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 42.07 us | 41.79 us - 44.79 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 53.60 us | 52.00 us - 54.70 us |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 234.20 us | 226.70 us - 237.70 us |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 1 / 10 | 65.7 ns | 64.8 ns - 67.3 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 2 / 10 | 67.5 ns | 67.1 ns - 73.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 3 / 10 | 92.7 ns | 91.3 ns - 93.9 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 4 / 10 | 99.4 ns | 96.7 ns - 101.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 5 / 10 | 104.6 ns | 103.9 ns - 116.5 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 111.4 ns | 106.8 ns - 114.3 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 7 / 10 | 336.2 ns | 333.5 ns - 337.7 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 8 / 10 | 421.8 ns | 415.3 ns - 424.6 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 653.1 ns | 634.5 ns - 734.8 ns |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 1.27 us | 1.25 us - 1.32 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 243.8 ns | 237.9 ns - 260.2 ns |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 2 / 8 | 395.7 ns | 390.6 ns - 400.9 ns |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 3 / 8 | 1.34 us | 1.30 us - 1.35 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 4 / 8 | 1.36 us | 1.34 us - 1.41 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 5 / 8 | 1.99 us | 1.96 us - 2.00 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 6 / 8 | 55.60 us | 53.80 us - 57.90 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 7 / 8 | 127.00 us | 123.80 us - 132.20 us |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 297.20 us | 285.40 us - 306.90 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 164.6 ns | 158.8 ns - 170.7 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 168.8 ns | 161.7 ns - 173.6 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 227.2 ns | 218.4 ns - 228.9 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 4 / 10 | 512.5 ns | 448.1 ns - 521.4 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 5 / 10 | 543.5 ns | 541.8 ns - 554.0 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 551.6 ns | 546.2 ns - 558.7 ns |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 7 / 10 | 1.10 us | 1.08 us - 1.11 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 8 / 10 | 1.36 us | 1.35 us - 1.40 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 9 / 10 | 1.96 us | 1.93 us - 2.02 us |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 10 / 10 | 4.44 us | 4.41 us - 4.46 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 1.21 us | 1.16 us - 1.24 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 2 / 8 | 2.07 us | 2.03 us - 2.21 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 3 / 8 | 4.76 us | 4.68 us - 4.85 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 4 / 8 | 5.57 us | 5.48 us - 5.74 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 5 / 8 | 6.80 us | 6.50 us - 6.82 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 6 / 8 | 91.60 us | 88.90 us - 94.90 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 7 / 8 | 278.10 us | 270.90 us - 302.50 us |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 622.00 us | 604.90 us - 632.70 us |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 1 / 10 | 102.9 ns | 100.7 ns - 103.2 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 2 / 10 | 103.2 ns | 101.2 ns - 110.9 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify | 3 / 10 | 107.9 ns | 104.5 ns - 113.8 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 4 / 10 | 112.3 ns | 109.6 ns - 115.7 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typedi | 5 / 10 | 118.1 ns | 117.7 ns - 119.3 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 6 / 10 | 120.1 ns | 117.6 ns - 123.9 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 7 / 10 | 122.3 ns | 119.9 ns - 125.3 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 8 / 10 | 137.9 ns | 133.3 ns - 138.3 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 298.5 ns | 297.1 ns - 306.9 ns |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 591.5 ns | 588.7 ns - 603.5 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 282.1 ns | 277.8 ns - 287.5 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 284.3 ns | 276.9 ns - 289.6 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 3 / 10 | 354.8 ns | 347.8 ns - 359.9 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 4 / 10 | 383.7 ns | 382.4 ns - 395.0 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 5 / 10 | 535.1 ns | 475.8 ns - 551.1 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 6 / 10 | 538.0 ns | 513.9 ns - 557.2 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 770.9 ns | 758.4 ns - 774.5 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 8 / 10 | 837.7 ns | 833.6 ns - 852.7 ns |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 9 / 10 | 1.44 us | 1.43 us - 1.48 us |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 1.65 us | 1.63 us - 1.75 us |

## Memory Summary

| Runtime | Mode | Scenario | Library / configuration | Place | Allocations |
| --- | --- | --- | --- | ---: | ---: |
| Node.js | complete | `registrationClass` | typed-inject | 1 / 9 | 283.16 KB |
| Node.js | complete | `registrationClass` | typedi | 2 / 9 | 422.92 KB |
| Node.js | complete | `registrationClass` | tsyringe | 3 / 9 | 463.65 KB |
| Node.js | complete | `registrationClass` | needle-di | 4 / 9 | 550.92 KB |
| Node.js | complete | `registrationClass` | scope-di | 5 / 9 | 562.81 KB |
| Node.js | complete | `registrationClass` | scope-di-codegen | 6 / 9 | 565.10 KB |
| Node.js | complete | `registrationClass` | awilix | 7 / 9 | 1.35 MB |
| Node.js | complete | `registrationClass` | inversify-jit | 8 / 9 | 3.52 MB |
| Node.js | complete | `registrationClass` | inversify | 9 / 9 | 3.52 MB |
| Node.js | complete | `registrationValue` | typedi | 1 / 9 | 120.46 KB |
| Node.js | complete | `registrationValue` | tsyringe | 2 / 9 | 133.91 KB |
| Node.js | complete | `registrationValue` | needle-di | 3 / 9 | 135.31 KB |
| Node.js | complete | `registrationValue` | typed-inject | 4 / 9 | 138.71 KB |
| Node.js | complete | `registrationValue` | awilix | 5 / 9 | 301.18 KB |
| Node.js | complete | `registrationValue` | scope-di | 6 / 9 | 409.33 KB |
| Node.js | complete | `registrationValue` | scope-di-codegen | 7 / 9 | 409.88 KB |
| Node.js | complete | `registrationValue` | inversify-jit | 8 / 9 | 3.12 MB |
| Node.js | complete | `registrationValue` | inversify | 9 / 9 | 3.12 MB |
| Node.js | complete | `registrationFactory` | typed-inject | 1 / 9 | 138.98 KB |
| Node.js | complete | `registrationFactory` | tsyringe | 2 / 9 | 164.97 KB |
| Node.js | complete | `registrationFactory` | typedi | 3 / 9 | 194.86 KB |
| Node.js | complete | `registrationFactory` | needle-di | 4 / 9 | 219.28 KB |
| Node.js | complete | `registrationFactory` | scope-di-codegen | 5 / 9 | 409.80 KB |
| Node.js | complete | `registrationFactory` | scope-di | 6 / 9 | 409.86 KB |
| Node.js | complete | `registrationFactory` | awilix | 7 / 9 | 1.08 MB |
| Node.js | complete | `registrationFactory` | inversify-jit | 8 / 9 | 3.21 MB |
| Node.js | complete | `registrationFactory` | inversify | 9 / 9 | 3.21 MB |
| Node.js | complete | `warmResolveValue` | typed-inject | 1 / 11 | 1 B |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload-codegen | 2 / 11 | 2 B |
| Node.js | complete | `warmResolveValue` | scope-di-module-reload | 3 / 11 | 2 B |
| Node.js | complete | `warmResolveValue` | scope-di | 4 / 11 | 2 B |
| Node.js | complete | `warmResolveValue` | scope-di-codegen | 5 / 11 | 2 B |
| Node.js | complete | `warmResolveValue` | needle-di | 6 / 11 | 3 B |
| Node.js | complete | `warmResolveValue` | typedi | 7 / 11 | 8 B |
| Node.js | complete | `warmResolveValue` | inversify | 8 / 11 | 49 B |
| Node.js | complete | `warmResolveValue` | inversify-jit | 9 / 11 | 49 B |
| Node.js | complete | `warmResolveValue` | awilix | 10 / 11 | 98 B |
| Node.js | complete | `warmResolveValue` | tsyringe | 11 / 11 | 222 B |
| Node.js | complete | `coldResolveValue` | typed-inject | 1 / 9 | 1 B |
| Node.js | complete | `coldResolveValue` | typedi | 2 / 9 | 11 B |
| Node.js | complete | `coldResolveValue` | scope-di | 3 / 9 | 28 B |
| Node.js | complete | `coldResolveValue` | scope-di-codegen | 4 / 9 | 30 B |
| Node.js | complete | `coldResolveValue` | awilix | 5 / 9 | 252 B |
| Node.js | complete | `coldResolveValue` | tsyringe | 6 / 9 | 293 B |
| Node.js | complete | `coldResolveValue` | needle-di | 7 / 9 | 673 B |
| Node.js | complete | `coldResolveValue` | inversify | 8 / 9 | 5.09 KB |
| Node.js | complete | `coldResolveValue` | inversify-jit | 9 / 9 | 5.15 KB |
| Node.js | complete | `warmResolveSingletonClass` | typed-inject | 1 / 11 | 0 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload | 2 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-module-reload-codegen | 3 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di | 4 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonClass` | scope-di-codegen | 5 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonClass` | inversify-jit | 6 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonClass` | inversify | 7 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonClass` | needle-di | 8 / 11 | 4 B |
| Node.js | complete | `warmResolveSingletonClass` | typedi | 9 / 11 | 8 B |
| Node.js | complete | `warmResolveSingletonClass` | awilix | 10 / 11 | 59 B |
| Node.js | complete | `warmResolveSingletonClass` | tsyringe | 11 / 11 | 223 B |
| Node.js | complete | `coldResolveSingletonClass` | scope-di-codegen | 1 / 9 | 56 B |
| Node.js | complete | `coldResolveSingletonClass` | scope-di | 2 / 9 | 59 B |
| Node.js | complete | `coldResolveSingletonClass` | typed-inject | 3 / 9 | 149 B |
| Node.js | complete | `coldResolveSingletonClass` | awilix | 4 / 9 | 317 B |
| Node.js | complete | `coldResolveSingletonClass` | tsyringe | 5 / 9 | 469 B |
| Node.js | complete | `coldResolveSingletonClass` | typedi | 6 / 9 | 502 B |
| Node.js | complete | `coldResolveSingletonClass` | needle-di | 7 / 9 | 667 B |
| Node.js | complete | `coldResolveSingletonClass` | inversify-jit | 8 / 9 | 7.92 KB |
| Node.js | complete | `coldResolveSingletonClass` | inversify | 9 / 9 | 8.10 KB |
| Node.js | complete | `warmResolveTransientClass` | scope-di-codegen | 1 / 10 | 25 B |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload-codegen | 2 / 10 | 25 B |
| Node.js | complete | `warmResolveTransientClass` | scope-di | 3 / 10 | 25 B |
| Node.js | complete | `warmResolveTransientClass` | scope-di-module-reload | 4 / 10 | 26 B |
| Node.js | complete | `warmResolveTransientClass` | inversify | 5 / 10 | 26 B |
| Node.js | complete | `warmResolveTransientClass` | inversify-jit | 6 / 10 | 26 B |
| Node.js | complete | `warmResolveTransientClass` | typed-inject | 7 / 10 | 115 B |
| Node.js | complete | `warmResolveTransientClass` | awilix | 8 / 10 | 123 B |
| Node.js | complete | `warmResolveTransientClass` | tsyringe | 9 / 10 | 357 B |
| Node.js | complete | `warmResolveTransientClass` | typedi | 10 / 10 | 456 B |
| Node.js | complete | `coldResolveTransientClass` | scope-di | 1 / 8 | 37 B |
| Node.js | complete | `coldResolveTransientClass` | typed-inject | 2 / 8 | 115 B |
| Node.js | complete | `coldResolveTransientClass` | awilix | 3 / 8 | 276 B |
| Node.js | complete | `coldResolveTransientClass` | tsyringe | 4 / 8 | 429 B |
| Node.js | complete | `coldResolveTransientClass` | typedi | 5 / 8 | 506 B |
| Node.js | complete | `coldResolveTransientClass` | scope-di-codegen | 6 / 8 | 535 B |
| Node.js | complete | `coldResolveTransientClass` | inversify | 7 / 8 | 7.20 KB |
| Node.js | complete | `coldResolveTransientClass` | inversify-jit | 8 / 8 | 11.37 KB |
| Node.js | complete | `warmResolveSingletonFactory` | typed-inject | 1 / 11 | 0 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di | 2 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-codegen | 3 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload-codegen | 4 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonFactory` | scope-di-module-reload | 5 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonFactory` | inversify | 6 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonFactory` | inversify-jit | 7 / 11 | 2 B |
| Node.js | complete | `warmResolveSingletonFactory` | needle-di | 8 / 11 | 3 B |
| Node.js | complete | `warmResolveSingletonFactory` | typedi | 9 / 11 | 8 B |
| Node.js | complete | `warmResolveSingletonFactory` | awilix | 10 / 11 | 59 B |
| Node.js | complete | `warmResolveSingletonFactory` | tsyringe | 11 / 11 | 220 B |
| Node.js | complete | `coldResolveSingletonFactory` | typedi | 1 / 9 | 10 B |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di | 2 / 9 | 26 B |
| Node.js | complete | `coldResolveSingletonFactory` | scope-di-codegen | 3 / 9 | 28 B |
| Node.js | complete | `coldResolveSingletonFactory` | typed-inject | 4 / 9 | 125 B |
| Node.js | complete | `coldResolveSingletonFactory` | tsyringe | 5 / 9 | 293 B |
| Node.js | complete | `coldResolveSingletonFactory` | awilix | 6 / 9 | 295 B |
| Node.js | complete | `coldResolveSingletonFactory` | needle-di | 7 / 9 | 717 B |
| Node.js | complete | `coldResolveSingletonFactory` | inversify-jit | 8 / 9 | 6.18 KB |
| Node.js | complete | `coldResolveSingletonFactory` | inversify | 9 / 9 | 6.23 KB |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload-codegen | 1 / 10 | 42 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-module-reload | 2 / 10 | 42 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di-codegen | 3 / 10 | 42 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | scope-di | 4 / 10 | 42 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typedi | 5 / 10 | 49 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify | 6 / 10 | 89 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | inversify-jit | 7 / 10 | 89 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | typed-inject | 8 / 10 | 131 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | awilix | 9 / 10 | 138 B |
| Node.js | complete | `warmResolveTransientFactoryWithChangingShape` | tsyringe | 10 / 10 | 262 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload-codegen | 1 / 10 | 57 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-module-reload | 2 / 10 | 57 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di-codegen | 3 / 10 | 57 B |
| Node.js | complete | `warmResolveTransientFactory` | scope-di | 4 / 10 | 58 B |
| Node.js | complete | `warmResolveTransientFactory` | inversify-jit | 5 / 10 | 58 B |
| Node.js | complete | `warmResolveTransientFactory` | inversify | 6 / 10 | 58 B |
| Node.js | complete | `warmResolveTransientFactory` | typedi | 7 / 10 | 65 B |
| Node.js | complete | `warmResolveTransientFactory` | typed-inject | 8 / 10 | 147 B |
| Node.js | complete | `warmResolveTransientFactory` | awilix | 9 / 10 | 154 B |
| Node.js | complete | `warmResolveTransientFactory` | tsyringe | 10 / 10 | 276 B |
| Node.js | complete | `coldResolveTransientFactory` | typedi | 1 / 8 | 66 B |
| Node.js | complete | `coldResolveTransientFactory` | scope-di | 2 / 8 | 68 B |
| Node.js | complete | `coldResolveTransientFactory` | typed-inject | 3 / 8 | 147 B |
| Node.js | complete | `coldResolveTransientFactory` | awilix | 4 / 8 | 309 B |
| Node.js | complete | `coldResolveTransientFactory` | tsyringe | 5 / 8 | 343 B |
| Node.js | complete | `coldResolveTransientFactory` | scope-di-codegen | 6 / 8 | 572 B |
| Node.js | complete | `coldResolveTransientFactory` | inversify | 7 / 8 | 6.47 KB |
| Node.js | complete | `coldResolveTransientFactory` | inversify-jit | 8 / 8 | 9.09 KB |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload-codegen | 1 / 10 | 90 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-codegen | 2 / 10 | 90 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di-module-reload | 3 / 10 | 90 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | scope-di | 4 / 10 | 90 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | typedi | 5 / 10 | 101 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify | 6 / 10 | 138 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | inversify-jit | 7 / 10 | 138 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | awilix | 8 / 10 | 401 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | typed-inject | 9 / 10 | 604 B |
| Node.js | complete | `warmResolveTransientFactoryChain` | tsyringe | 10 / 10 | 772 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | typedi | 1 / 8 | 102 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di | 2 / 8 | 158 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | awilix | 3 / 8 | 540 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | typed-inject | 4 / 8 | 604 B |
| Node.js | complete | `coldResolveTransientFactoryChain` | tsyringe | 5 / 8 | 1.06 KB |
| Node.js | complete | `coldResolveTransientFactoryChain` | scope-di-codegen | 6 / 8 | 1.28 KB |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify | 7 / 8 | 19.06 KB |
| Node.js | complete | `coldResolveTransientFactoryChain` | inversify-jit | 8 / 8 | 31.09 KB |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload | 2 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-module-reload-codegen | 3 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 4 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify | 5 / 10 | 421 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | inversify-jit | 6 / 10 | 490 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | awilix | 7 / 10 | 813 B |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typed-inject | 8 / 10 | 1.25 KB |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | tsyringe | 9 / 10 | 2.06 KB |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | typedi | 10 / 10 | 2.36 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di | 1 / 8 | 234 B |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | awilix | 2 / 8 | 938 B |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typed-inject | 3 / 8 | 1.26 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | typedi | 4 / 8 | 2.37 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | tsyringe | 5 / 8 | 3.13 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | scope-di-codegen | 6 / 8 | 3.20 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify | 7 / 8 | 32.45 KB |
| Node.js | complete | `coldResolveTransientFactoryWithFiveDependencies` | inversify-jit | 8 / 8 | 61.09 KB |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 1 / 10 | 218 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload-codegen | 2 / 10 | 218 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di-module-reload | 3 / 10 | 411 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | scope-di | 4 / 10 | 412 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify | 5 / 10 | 457 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | inversify-jit | 6 / 10 | 542 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | awilix | 7 / 10 | 889 B |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typed-inject | 8 / 10 | 1.47 KB |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | tsyringe | 9 / 10 | 2.44 KB |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | typedi | 10 / 10 | 2.83 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di | 1 / 8 | 467 B |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | awilix | 2 / 8 | 1.06 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typed-inject | 3 / 8 | 1.45 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | typedi | 4 / 8 | 2.83 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | tsyringe | 5 / 8 | 3.40 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | scope-di-codegen | 6 / 8 | 3.74 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify | 7 / 8 | 35.55 KB |
| Node.js | complete | `coldResolveTransientFactoryWithSixDependencies` | inversify-jit | 8 / 8 | 68.26 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-codegen | 1 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload | 2 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di-module-reload-codegen | 3 / 10 | 186 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify-jit | 4 / 10 | 236 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | inversify | 5 / 10 | 247 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | scope-di | 6 / 10 | 273 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typedi | 7 / 10 | 640 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | awilix | 8 / 10 | 759 B |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | typed-inject | 9 / 10 | 1.19 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepChain` | tsyringe | 10 / 10 | 1.66 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di | 1 / 8 | 281 B |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typedi | 2 / 8 | 649 B |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | awilix | 3 / 8 | 934 B |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | typed-inject | 4 / 8 | 1.18 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | tsyringe | 5 / 8 | 2.56 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | scope-di-codegen | 6 / 8 | 2.97 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify | 7 / 8 | 29.85 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepChain` | inversify-jit | 8 / 8 | 59.52 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload-codegen | 1 / 10 | 353 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 2 / 10 | 353 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di | 3 / 10 | 589 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify | 4 / 10 | 598 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | scope-di-module-reload | 5 / 10 | 605 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | inversify-jit | 6 / 10 | 731 B |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | awilix | 7 / 10 | 1.40 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typed-inject | 8 / 10 | 2.35 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | tsyringe | 9 / 10 | 3.86 KB |
| Node.js | complete | `warmResolveTransientFactoryWithTenDependencies` | typedi | 10 / 10 | 4.68 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di | 1 / 8 | 571 B |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | awilix | 2 / 8 | 1.59 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typed-inject | 3 / 8 | 2.36 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | typedi | 4 / 8 | 4.72 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | tsyringe | 5 / 8 | 6.25 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | scope-di-codegen | 6 / 8 | 10.46 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify | 7 / 8 | 51.77 KB |
| Node.js | complete | `coldResolveTransientFactoryWithTenDependencies` | inversify-jit | 8 / 8 | 99.59 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload | 1 / 10 | 980 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 981 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di | 3 / 10 | 984 B |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 4 / 10 | 1.02 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify | 5 / 10 | 2.14 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | tsyringe | 6 / 10 | 2.31 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | inversify-jit | 7 / 10 | 2.52 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typedi | 8 / 10 | 3.65 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | awilix | 9 / 10 | 3.96 KB |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | typed-inject | 10 / 10 | 6.58 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di | 1 / 8 | 1.15 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typedi | 2 / 8 | 3.46 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | awilix | 3 / 8 | 4.23 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | typed-inject | 4 / 8 | 6.60 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | tsyringe | 5 / 8 | 9.14 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | scope-di-codegen | 6 / 8 | 22.89 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify | 7 / 8 | 139.48 KB |
| Node.js | complete | `coldResolveTransientFactoryDeepWideGraph` | inversify-jit | 8 / 8 | 261.89 KB |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-codegen | 1 / 10 | 173 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload-codegen | 2 / 10 | 177 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typedi | 3 / 10 | 194 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di-module-reload | 4 / 10 | 314 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | scope-di | 5 / 10 | 316 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | typed-inject | 6 / 10 | 322 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify | 7 / 10 | 358 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | inversify-jit | 8 / 10 | 481 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | awilix | 9 / 10 | 760 B |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | tsyringe | 10 / 10 | 2.50 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di | 1 / 10 | 386 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-codegen | 2 / 10 | 387 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload | 3 / 10 | 388 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | scope-di-module-reload-codegen | 4 / 10 | 388 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typedi | 5 / 10 | 409 B |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify | 6 / 10 | 1.54 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | typed-inject | 7 / 10 | 1.58 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | inversify-jit | 8 / 10 | 1.92 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | awilix | 9 / 10 | 2.37 KB |
| Node.js | complete | `warmResolveCachedFactoryDeepWideGraph` | tsyringe | 10 / 10 | 7.09 KB |

## Runtime Matrix

| Runtime | Version | Machine | Mode | Registrations per batch | Result file |
| --- | --- | --- | --- | ---: | --- |
| Node.js | v26.11.1 | ALIEN / 13th Gen Intel(R) Core(TM) i9-13900HX / win32 10.0.26300 x64 | complete | 300 | [`bench_node_json_complete.json`](./bench_node_json_complete.json) |

## Source

| Field | Value |
| --- | --- |
| Commit | [7de000ef198459b0a478103290b40a43dc266e0e](https://github.com/SvS-tm/scope-di/commit/7de000ef198459b0a478103290b40a43dc266e0e) |
| Branch | chore/benchmarks-alien |
