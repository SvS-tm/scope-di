<h1 align="center">scope-di Benchmarks</h1>

<p align="center">
    <img src="./docs/assets/readme-banner.svg" alt="scope-di Benchmarks" width="100%" />
</p>

Runtime and memory comparison report for `@svs-tm/scope-di`.

This page is for developers evaluating whether `scope-di` is a good fit for an application. It focuses on comparable dependency injection behavior: registration, warm resolution, cold resolution, transient graphs, cached graphs, speed, and memory.

## Summary

`scope-di` is designed to trade a little explicit configuration for strong TypeScript inference and a runtime path without decorators or reflection.

Read this report as an adoption aid, not as a synthetic trophy board. The useful question is not whether one library wins every micro-case; it is whether the runtime cost is reasonable for the features and DX you get.

The most important benchmark questions are:

- How expensive is ordinary hot dependency resolution?
- How does transient graph resolution compare with other DI containers?
- How much memory is allocated during resolution?
- How expensive is registration compared with runtime resolution?
- Do wider and deeper dependency graphs change the ranking?

Official release numbers should be read from the tables below once a locked benchmark run is published.

## Compared Libraries

| Library | Package | Primary style |
| --- | --- | --- |
| scope-di | `@svs-tm/scope-di` | Explicit typed builder, key-based resolution. |
| Inversify | `inversify` | Decorator/metadata-oriented container. |
| TSyringe | `tsyringe` | Decorator/metadata-oriented container. |
| Awilix | `awilix` | Registration container with resolver helpers. |
| TypeDI | `typedi` | Decorator/metadata-oriented container. |
| Typed Inject | `typed-inject` | Token-based typed injection. |
| Needle DI | `@needle-di/core` | Token/provider-based injection. |

## Feature Context

Benchmarks are only meaningful when the compared behavior overlaps. These tests intentionally focus on core DI operations that most libraries can express.

| Capability | Included in public comparison | Notes |
| --- | --- | --- |
| Value registration and resolution | Yes | Simple baseline. |
| Singleton class/factory resolution | Yes | Measures cached dependency paths. |
| Transient class/factory resolution | Yes | Measures fresh dependency creation. |
| Factory graphs | Yes | Measures dependency lookup plus factory invocation. |
| Deep and wide graphs | Yes | Measures graph traversal behavior. |
| Cold resolution | Yes | Fresh container/scope per measured run. |
| Registration | Yes | Useful, but lower priority than runtime resolution for most apps. |
| Async dependencies | Planned | Some libraries do not model this directly. |
| Collection registrations | Planned separately | Not every library has an equivalent feature. |
| Scope inheritance | No | `scope-di`-specific behavior, not a fair competitor case. |

## Official Results

Official numbers are pending the final published benchmark run. Once published, this section should be the first place readers look.

### Speed Summary

| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveSingletonClass` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientClass` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveSingletonFactory` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactory` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactoryWithSixDependencies` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `registrationClass` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `registrationValue` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `registrationFactory` | TBD | TBD | TBD | TBD | TBD | TBD |

### Memory Summary

| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |
| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |
| Node.js | complete | `warmResolveValue` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveSingletonClass` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientClass` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactory` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactoryWithFiveDependencies` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveTransientFactoryDeepWideGraph` | TBD | TBD | TBD | TBD | TBD | TBD |
| Node.js | complete | `warmResolveCachedFactoryWideGraph` | TBD | TBD | TBD | TBD | TBD | TBD |

### Runtime Matrix

| Runtime | Version | Machine | Mode | Iterations | Result file |
| --- | --- | --- | --- | ---: | --- |
| Node.js | TBD | TBD | complete | TBD | TBD |
| Bun | TBD | TBD | complete | TBD | TBD |
| Deno | TBD | TBD | complete | TBD | TBD |

## How To Read The Numbers

Prefer warm resolution results when thinking about normal application runtime. In most applications, the container is configured once and dependencies are resolved many times.

Cold resolution is useful when a library creates many short-lived containers or request-level scopes. It should not be mixed with registration benchmarks.

Registration numbers are interesting for startup-heavy systems, serverless cold starts, tests that create many containers, and tools that dynamically compose graphs. They are usually less important than runtime resolution for long-lived applications.

Memory numbers matter when a hot path resolves many transient dependencies. A library can be fast in time but expensive in allocations, so both views should be checked together.

## Scenario Details

### Warm Resolution

Warm resolution measures dependency resolution after the container or scope has already been constructed.

| Scenario | Description |
| --- | --- |
| `warmResolveValue` | Resolve a value dependency. |
| `warmResolveSingletonClass` | Resolve a cached singleton class dependency. |
| `warmResolveTransientClass` | Resolve a transient class dependency. |
| `warmResolveSingletonFactory` | Resolve a cached singleton factory dependency. |
| `warmResolveTransientFactory` | Resolve a transient factory dependency. |
| `warmResolveTransientFactoryChain` | Resolve a shallow transient factory graph. |
| `warmResolveTransientFactoryWithFiveDependencies` | Resolve a transient factory with five direct dependencies. |
| `warmResolveTransientFactoryWithSixDependencies` | Resolve a transient factory with six direct dependencies. |
| `warmResolveTransientFactoryDeepChain` | Resolve a deeper transient factory chain. |
| `warmResolveTransientFactoryWithTenDependencies` | Resolve a transient factory with ten direct dependencies. |
| `warmResolveTransientFactoryDeepWideGraph` | Resolve a graph that is both deeper and wider. |
| `warmResolveCachedFactoryWideGraph` | Resolve a cached wide factory graph. |
| `warmResolveCachedFactoryDeepWideGraph` | Resolve a cached graph that is both deeper and wider. |

### Cold Resolution

Cold resolution measures resolution against a fresh container or scope for each measured run. Container construction is prepared outside the measured callback.

| Scenario | Description |
| --- | --- |
| `coldResolveValue` | Resolve a value dependency from a fresh container. |
| `coldResolveSingletonClass` | Resolve a singleton class dependency from a fresh container. |
| `coldResolveTransientClass` | Resolve a transient class dependency from a fresh container. |
| `coldResolveSingletonFactory` | Resolve a singleton factory dependency from a fresh container. |
| `coldResolveTransientFactory` | Resolve a transient factory dependency from a fresh container. |
| `coldResolveTransientFactoryChain` | Resolve a shallow transient graph from a fresh container. |
| `coldResolveTransientFactoryWithFiveDependencies` | Resolve a transient factory with five direct dependencies from a fresh container. |
| `coldResolveTransientFactoryWithSixDependencies` | Resolve a transient factory with six direct dependencies from a fresh container. |
| `coldResolveTransientFactoryDeepChain` | Resolve a deeper transient graph from a fresh container. |
| `coldResolveTransientFactoryWithTenDependencies` | Resolve a transient factory with ten direct dependencies from a fresh container. |
| `coldResolveTransientFactoryDeepWideGraph` | Resolve a deep and wide transient graph from a fresh container. |

### Registration

Registration benchmarks measure container configuration.

| Scenario | Description |
| --- | --- |
| `registrationClass` | Register a class dependency. |
| `registrationValue` | Register a value dependency. |
| `registrationFactory` | Register a factory dependency. |

### Diagnostics

Diagnostics are internal `scope-di` measurements. They are useful for explaining optimization work, but they should stay separate from public competitor charts.

| Scenario | Description |
| --- | --- |
| `diagnostics:scope-di:registryResolveSingleDescriptor` | Registry lookup for a singular key. |
| `diagnostics:scope-di:registryResolveCollectionDescriptors` | Registry lookup for a collection key. |
| `diagnostics:scope-di:findResolvedSingletonMiss` | Singleton cache miss lookup. |
| `diagnostics:scope-di:findResolvedSingletonHit` | Singleton cache hit lookup. |
| `diagnostics:scope-di:findResolvedTransient` | Transient lookup path. |
| `diagnostics:scope-di:resolveNoKeys` | Empty range resolution. |
| `diagnostics:scope-di:resolveCachedValue` | Cached value resolution. |
| `diagnostics:scope-di:resolveColdValue` | Cold value resolution. |
| `diagnostics:scope-di:findResolvedValueMiss` | Value cache miss lookup. |
| `diagnostics:scope-di:findResolvedValueHit` | Value cache hit lookup. |
| `diagnostics:scope-di:resolveCachedThreeValues` | Cached range resolution for three keys. |
| `diagnostics:scope-di:resolveCachedFiveValues` | Cached range resolution for five keys. |
| `diagnostics:scope-di:resolveCachedSixValues` | Cached range resolution for six keys. |
| `diagnostics:scope-di:resolveCollectionValues` | Collection value resolution. |
| `diagnostics:scope-di:resolveTransientFactoryWithFiveDependencies` | Transient factory path with five dependencies. |
| `diagnostics:scope-di:resolveTransientFactoryWithSixDependencies` | Transient factory path with six dependencies. |
| `diagnostics:scope-di:createChildScope` | Child scope creation. |
| `diagnostics:scope-di:disposeEmptyScope` | Empty scope disposal. |
| `diagnostics:scope-di:disposeResolvedSingleton` | Disposal after singleton resolution. |

## Fairness Notes

The public comparison uses idiomatic APIs for each library where possible. Some libraries resolve by token, some by string key, some through metadata, and some through factory functions. The benchmark names describe the behavior being measured rather than claiming identical internal mechanics.

Public charts should compare only equivalent scenarios. `scope-di`-specific features such as inherited scopes and typed collection inference should be documented as library features, not benchmarked as competitor cases unless another library exposes a direct equivalent.

## Reporting Requirements

Every published result should include:

- CPU and operating system.
- Runtime name and version.
- Benchmark mode.
- Iteration count.
- Exact commit or package version.
- Whether the row measures speed or memory.
- Whether the scenario is warm resolution, cold resolution, registration, or diagnostics.

## License

<p>
    <a href="../../LICENSE"><img src="../../docs/assets/logo.svg" alt="scope-di logo" width="32" /></a>
    <br />
    <a href="../../LICENSE">MIT</a>
</p>
