# Scope DI Startup

One scope is registered and built per fresh process. Process launch and initial imports are excluded. Times are milliseconds; each column shows its own median across processes. These measurements are separate from calibrated resolution timings and competitor registration comparisons.

| Workload / configuration | Processes | Registration (ms) | Build (ms) | Total (ms) | Total range (ms) |
| --- | ---: | ---: | ---: | ---: | --- |
| scope-di:transientClass | 5 | 0.111 | 0.275 | 0.385 | 0.381 - 0.391 |
| scope-di-codegen:transientClass | 5 | 0.112 | 0.415 | 0.528 | 0.523 - 0.531 |
| scope-di-module-reload:transientClass | 5 | 0.113 | 1.588 | 1.703 | 1.656 - 22.859 |
| scope-di-module-reload-codegen:transientClass | 5 | 0.110 | 1.571 | 1.687 | 1.656 - 1.709 |
| scope-di:factoryFiveDependencies | 5 | 0.172 | 0.430 | 0.603 | 0.596 - 0.606 |
| scope-di-codegen:factoryFiveDependencies | 5 | 0.173 | 0.729 | 0.903 | 0.901 - 0.915 |
| scope-di-module-reload:factoryFiveDependencies | 5 | 0.173 | 3.556 | 3.748 | 3.260 - 3.830 |
| scope-di-module-reload-codegen:factoryFiveDependencies | 5 | 0.170 | 3.651 | 3.821 | 3.636 - 4.233 |
| scope-di:factoryTenDependencies | 5 | 0.195 | 0.448 | 0.643 | 0.633 - 0.647 |
| scope-di-codegen:factoryTenDependencies | 5 | 0.194 | 0.876 | 1.071 | 1.058 - 1.109 |
| scope-di-module-reload:factoryTenDependencies | 5 | 0.192 | 5.282 | 5.473 | 5.416 - 5.492 |
| scope-di-module-reload-codegen:factoryTenDependencies | 5 | 0.190 | 5.445 | 5.637 | 5.510 - 5.838 |
| scope-di:factoryDeepWideGraph | 5 | 0.280 | 0.463 | 0.743 | 0.736 - 0.756 |
| scope-di-codegen:factoryDeepWideGraph | 5 | 0.286 | 1.289 | 1.575 | 1.545 - 1.768 |
| scope-di-module-reload:factoryDeepWideGraph | 5 | 0.285 | 12.717 | 13.001 | 12.086 - 13.372 |
| scope-di-module-reload-codegen:factoryDeepWideGraph | 5 | 0.282 | 12.097 | 12.375 | 11.903 - 13.009 |
| scope-di:cachedFactoryDeepWideGraph | 5 | 0.285 | 0.461 | 0.745 | 0.739 - 0.766 |
| scope-di-codegen:cachedFactoryDeepWideGraph | 5 | 0.284 | 0.751 | 1.035 | 1.019 - 1.053 |
| scope-di-module-reload:cachedFactoryDeepWideGraph | 5 | 0.278 | 3.725 | 4.003 | 3.797 - 4.310 |
| scope-di-module-reload-codegen:cachedFactoryDeepWideGraph | 5 | 0.280 | 3.753 | 4.037 | 3.854 - 4.275 |
