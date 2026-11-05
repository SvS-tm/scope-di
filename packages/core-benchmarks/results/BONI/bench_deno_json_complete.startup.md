# Scope DI Startup

One scope is registered and built per fresh process. Process launch and initial imports are excluded. Times are milliseconds; each column shows its own median across processes. These measurements are separate from calibrated resolution timings and competitor registration comparisons.

| Workload / configuration | Processes | Registration (ms) | Build (ms) | Total (ms) | Total range (ms) |
| --- | ---: | ---: | ---: | ---: | --- |
| scope-di:transientClass | 5 | 0.115 | 0.298 | 0.413 | 0.404 - 1.050 |
| scope-di-codegen:transientClass | 5 | 0.115 | 0.433 | 0.546 | 0.544 - 0.567 |
| scope-di-module-reload:transientClass | 5 | 0.119 | 1.597 | 1.711 | 1.678 - 2.370 |
| scope-di-module-reload-codegen:transientClass | 5 | 0.114 | 1.614 | 1.737 | 1.629 - 2.373 |
| scope-di:factoryFiveDependencies | 5 | 0.180 | 0.437 | 0.617 | 0.608 - 0.622 |
| scope-di-codegen:factoryFiveDependencies | 5 | 0.179 | 0.752 | 0.930 | 0.922 - 1.742 |
| scope-di-module-reload:factoryFiveDependencies | 5 | 0.182 | 5.487 | 5.663 | 4.994 - 6.022 |
| scope-di-module-reload-codegen:factoryFiveDependencies | 5 | 0.180 | 4.818 | 4.999 | 4.950 - 5.964 |
| scope-di:factoryTenDependencies | 5 | 0.213 | 0.508 | 0.721 | 0.714 - 1.479 |
| scope-di-codegen:factoryTenDependencies | 5 | 0.211 | 1.624 | 1.836 | 1.115 - 2.056 |
| scope-di-module-reload:factoryTenDependencies | 5 | 0.210 | 8.793 | 9.005 | 8.358 - 9.233 |
| scope-di-module-reload-codegen:factoryTenDependencies | 5 | 0.210 | 8.866 | 9.075 | 8.481 - 9.310 |
| scope-di:factoryDeepWideGraph | 5 | 0.284 | 0.577 | 1.480 | 0.839 - 1.644 |
| scope-di-codegen:factoryDeepWideGraph | 5 | 0.286 | 1.983 | 2.263 | 1.635 - 2.406 |
| scope-di-module-reload:factoryDeepWideGraph | 5 | 0.281 | 21.740 | 22.018 | 21.621 - 24.795 |
| scope-di-module-reload-codegen:factoryDeepWideGraph | 5 | 0.282 | 22.279 | 22.558 | 21.987 - 23.060 |
| scope-di:cachedFactoryDeepWideGraph | 5 | 0.295 | 1.235 | 1.535 | 0.851 - 1.729 |
| scope-di-codegen:cachedFactoryDeepWideGraph | 5 | 0.313 | 0.882 | 1.747 | 1.130 - 1.884 |
| scope-di-module-reload:cachedFactoryDeepWideGraph | 5 | 0.285 | 5.814 | 6.103 | 5.983 - 6.668 |
| scope-di-module-reload-codegen:cachedFactoryDeepWideGraph | 5 | 0.284 | 5.644 | 5.928 | 5.292 - 7.090 |
