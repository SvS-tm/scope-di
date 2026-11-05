# Scope DI Startup

One scope is registered and built per fresh process. Process launch and initial imports are excluded. Times are milliseconds; each column shows its own median across processes. These measurements are separate from calibrated resolution timings and competitor registration comparisons.

| Workload / configuration | Processes | Registration (ms) | Build (ms) | Total (ms) | Total range (ms) |
| --- | ---: | ---: | ---: | ---: | --- |
| scope-di:transientClass | 5 | 0.073 | 0.187 | 0.257 | 0.255 - 0.286 |
| scope-di-codegen:transientClass | 5 | 0.073 | 0.278 | 0.347 | 0.345 - 0.369 |
| scope-di-module-reload:transientClass | 5 | 0.090 | 2.182 | 2.275 | 1.484 - 3.530 |
| scope-di-module-reload-codegen:transientClass | 5 | 0.077 | 1.455 | 1.532 | 1.407 - 2.004 |
| scope-di:factoryFiveDependencies | 5 | 0.116 | 0.267 | 0.384 | 0.379 - 0.400 |
| scope-di-codegen:factoryFiveDependencies | 5 | 0.114 | 1.139 | 1.273 | 0.582 - 1.336 |
| scope-di-module-reload:factoryFiveDependencies | 5 | 0.115 | 5.650 | 5.772 | 4.725 - 6.022 |
| scope-di-module-reload-codegen:factoryFiveDependencies | 5 | 0.113 | 4.696 | 4.817 | 4.646 - 6.423 |
| scope-di:factoryTenDependencies | 5 | 0.134 | 0.332 | 0.469 | 0.459 - 1.081 |
| scope-di-codegen:factoryTenDependencies | 5 | 0.131 | 0.609 | 0.735 | 0.721 - 0.768 |
| scope-di-module-reload:factoryTenDependencies | 5 | 0.134 | 8.035 | 8.169 | 7.298 - 8.940 |
| scope-di-module-reload-codegen:factoryTenDependencies | 5 | 0.135 | 8.300 | 8.436 | 8.095 - 9.140 |
| scope-di:factoryDeepWideGraph | 5 | 0.187 | 0.426 | 0.613 | 0.525 - 1.195 |
| scope-di-codegen:factoryDeepWideGraph | 5 | 0.183 | 0.936 | 1.561 | 0.978 - 1.870 |
| scope-di-module-reload:factoryDeepWideGraph | 5 | 0.181 | 20.103 | 20.281 | 19.616 - 20.404 |
| scope-di-module-reload-codegen:factoryDeepWideGraph | 5 | 0.190 | 19.973 | 20.519 | 19.489 - 21.416 |
| scope-di:cachedFactoryDeepWideGraph | 5 | 0.185 | 0.373 | 0.575 | 0.515 - 1.183 |
| scope-di-codegen:cachedFactoryDeepWideGraph | 5 | 0.176 | 0.547 | 0.848 | 0.704 - 1.452 |
| scope-di-module-reload:cachedFactoryDeepWideGraph | 5 | 0.180 | 4.765 | 4.959 | 4.778 - 5.424 |
| scope-di-module-reload-codegen:cachedFactoryDeepWideGraph | 5 | 0.210 | 5.143 | 5.322 | 4.930 - 6.023 |
