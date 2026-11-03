# Scope DI Startup

One scope is registered and built per fresh process. Process launch and initial imports are excluded. Times are milliseconds; each column shows its own median across processes. These measurements are separate from calibrated resolution timings and competitor registration comparisons.

| Workload / configuration | Processes | Registration (ms) | Build (ms) | Total (ms) | Total range (ms) |
| --- | ---: | ---: | ---: | ---: | --- |
| scope-di:transientClass | 5 | 0.106 | 0.284 | 0.389 | 0.385 - 0.392 |
| scope-di-codegen:transientClass | 5 | 0.107 | 0.485 | 0.593 | 0.584 - 0.601 |
| scope-di-module-reload:transientClass | 5 | 0.106 | 3.901 | 4.006 | 2.046 - 4.545 |
| scope-di-module-reload-codegen:transientClass | 5 | 0.106 | 1.949 | 2.054 | 2.046 - 4.098 |
| scope-di:factoryFiveDependencies | 5 | 0.167 | 0.419 | 0.585 | 0.566 - 0.592 |
| scope-di-codegen:factoryFiveDependencies | 5 | 0.174 | 0.874 | 1.048 | 1.002 - 1.180 |
| scope-di-module-reload:factoryFiveDependencies | 5 | 0.168 | 6.878 | 7.045 | 6.757 - 7.273 |
| scope-di-module-reload-codegen:factoryFiveDependencies | 5 | 0.169 | 6.718 | 6.882 | 6.768 - 7.224 |
| scope-di:factoryTenDependencies | 5 | 0.200 | 0.469 | 0.665 | 0.654 - 0.679 |
| scope-di-codegen:factoryTenDependencies | 5 | 0.200 | 0.985 | 1.186 | 1.130 - 1.210 |
| scope-di-module-reload:factoryTenDependencies | 5 | 0.204 | 11.394 | 11.598 | 11.144 - 12.840 |
| scope-di-module-reload-codegen:factoryTenDependencies | 5 | 0.201 | 11.774 | 11.976 | 11.555 - 13.818 |
| scope-di:factoryDeepWideGraph | 5 | 0.270 | 0.528 | 0.798 | 0.784 - 0.839 |
| scope-di-codegen:factoryDeepWideGraph | 5 | 0.269 | 1.452 | 1.741 | 1.712 - 1.801 |
| scope-di-module-reload:factoryDeepWideGraph | 5 | 0.269 | 28.361 | 28.627 | 28.402 - 31.432 |
| scope-di-module-reload-codegen:factoryDeepWideGraph | 5 | 0.269 | 31.228 | 31.506 | 27.985 - 32.175 |
| scope-di:cachedFactoryDeepWideGraph | 5 | 0.270 | 0.532 | 0.812 | 0.794 - 0.820 |
| scope-di-codegen:cachedFactoryDeepWideGraph | 5 | 0.267 | 0.924 | 1.190 | 1.183 - 1.230 |
| scope-di-module-reload:cachedFactoryDeepWideGraph | 5 | 0.265 | 6.791 | 7.056 | 6.991 - 9.772 |
| scope-di-module-reload-codegen:cachedFactoryDeepWideGraph | 5 | 0.273 | 7.105 | 7.371 | 7.012 - 10.891 |
