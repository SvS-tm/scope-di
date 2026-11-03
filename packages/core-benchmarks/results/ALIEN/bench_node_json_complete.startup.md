# Scope DI Startup

One scope is registered and built per fresh process. Process launch and initial imports are excluded. Times are milliseconds; each column shows its own median across processes. These measurements are separate from calibrated resolution timings and competitor registration comparisons.

| Workload / configuration | Processes | Registration (ms) | Build (ms) | Total (ms) | Total range (ms) |
| --- | ---: | ---: | ---: | ---: | --- |
| scope-di:transientClass | 5 | 0.076 | 0.196 | 0.274 | 0.252 - 0.282 |
| scope-di-codegen:transientClass | 5 | 0.072 | 0.339 | 0.414 | 0.386 - 0.520 |
| scope-di-module-reload:transientClass | 5 | 0.079 | 1.769 | 1.912 | 1.763 - 13.141 |
| scope-di-module-reload-codegen:transientClass | 5 | 0.074 | 1.656 | 1.736 | 1.636 - 1.840 |
| scope-di:factoryFiveDependencies | 5 | 0.117 | 0.281 | 0.402 | 0.381 - 0.499 |
| scope-di-codegen:factoryFiveDependencies | 5 | 0.118 | 0.605 | 0.721 | 0.680 - 0.808 |
| scope-di-module-reload:factoryFiveDependencies | 5 | 0.114 | 6.085 | 6.224 | 6.030 - 7.522 |
| scope-di-module-reload-codegen:factoryFiveDependencies | 5 | 0.113 | 6.231 | 6.343 | 6.208 - 8.248 |
| scope-di:factoryTenDependencies | 5 | 0.135 | 0.321 | 0.450 | 0.434 - 0.482 |
| scope-di-codegen:factoryTenDependencies | 5 | 0.146 | 0.690 | 0.818 | 0.801 - 1.026 |
| scope-di-module-reload:factoryTenDependencies | 5 | 0.137 | 10.010 | 10.146 | 9.323 - 12.035 |
| scope-di-module-reload-codegen:factoryTenDependencies | 5 | 0.147 | 9.913 | 10.060 | 9.449 - 11.491 |
| scope-di:factoryDeepWideGraph | 5 | 0.190 | 0.359 | 0.540 | 0.519 - 0.623 |
| scope-di-codegen:factoryDeepWideGraph | 5 | 0.196 | 0.949 | 1.123 | 1.091 - 1.208 |
| scope-di-module-reload:factoryDeepWideGraph | 5 | 0.175 | 23.556 | 23.731 | 22.876 - 25.187 |
| scope-di-module-reload-codegen:factoryDeepWideGraph | 5 | 0.183 | 23.995 | 24.177 | 22.463 - 26.602 |
| scope-di:cachedFactoryDeepWideGraph | 5 | 0.172 | 0.342 | 0.516 | 0.510 - 0.632 |
| scope-di-codegen:cachedFactoryDeepWideGraph | 5 | 0.171 | 0.621 | 0.791 | 0.768 - 0.832 |
| scope-di-module-reload:cachedFactoryDeepWideGraph | 5 | 0.179 | 5.964 | 6.142 | 5.949 - 6.850 |
| scope-di-module-reload-codegen:cachedFactoryDeepWideGraph | 5 | 0.181 | 6.310 | 6.596 | 6.022 - 7.622 |
