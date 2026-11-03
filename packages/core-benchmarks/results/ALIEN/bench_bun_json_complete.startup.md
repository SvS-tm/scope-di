# Scope DI Startup

One scope is registered and built per fresh process. Process launch and initial imports are excluded. Times are milliseconds; each column shows its own median across processes. These measurements are separate from calibrated resolution timings and competitor registration comparisons.

| Workload / configuration | Processes | Registration (ms) | Build (ms) | Total (ms) | Total range (ms) |
| --- | ---: | ---: | ---: | ---: | --- |
| scope-di:transientClass | 5 | 0.085 | 0.187 | 0.275 | 0.270 - 0.280 |
| scope-di-codegen:transientClass | 5 | 0.082 | 0.299 | 0.385 | 0.370 - 0.390 |
| scope-di-module-reload:transientClass | 5 | 0.081 | 1.192 | 1.275 | 1.070 - 27.281 |
| scope-di-module-reload-codegen:transientClass | 5 | 0.083 | 1.222 | 1.302 | 1.018 - 2.055 |
| scope-di:factoryFiveDependencies | 5 | 0.124 | 0.277 | 0.401 | 0.393 - 0.419 |
| scope-di-codegen:factoryFiveDependencies | 5 | 0.127 | 0.493 | 0.621 | 0.610 - 0.681 |
| scope-di-module-reload:factoryFiveDependencies | 5 | 0.122 | 2.862 | 2.988 | 2.474 - 3.161 |
| scope-di-module-reload-codegen:factoryFiveDependencies | 5 | 0.121 | 2.457 | 2.579 | 2.222 - 3.082 |
| scope-di:factoryTenDependencies | 5 | 0.142 | 0.295 | 0.442 | 0.411 - 0.466 |
| scope-di-codegen:factoryTenDependencies | 5 | 0.135 | 0.607 | 0.743 | 0.730 - 0.785 |
| scope-di-module-reload:factoryTenDependencies | 5 | 0.136 | 3.447 | 3.578 | 3.446 - 4.754 |
| scope-di-module-reload-codegen:factoryTenDependencies | 5 | 0.141 | 3.937 | 4.083 | 3.774 - 4.805 |
| scope-di:factoryDeepWideGraph | 5 | 0.203 | 0.297 | 0.495 | 0.492 - 0.606 |
| scope-di-codegen:factoryDeepWideGraph | 5 | 0.205 | 0.881 | 1.084 | 1.058 - 1.345 |
| scope-di-module-reload:factoryDeepWideGraph | 5 | 0.199 | 9.043 | 9.253 | 7.176 - 11.401 |
| scope-di-module-reload-codegen:factoryDeepWideGraph | 5 | 0.194 | 8.115 | 8.305 | 7.621 - 9.690 |
| scope-di:cachedFactoryDeepWideGraph | 5 | 0.192 | 0.310 | 0.501 | 0.483 - 0.519 |
| scope-di-codegen:cachedFactoryDeepWideGraph | 5 | 0.199 | 0.512 | 0.711 | 0.693 - 0.737 |
| scope-di-module-reload:cachedFactoryDeepWideGraph | 5 | 0.202 | 3.029 | 3.242 | 2.615 - 3.737 |
| scope-di-module-reload-codegen:cachedFactoryDeepWideGraph | 5 | 0.197 | 2.534 | 2.732 | 2.568 - 2.984 |
