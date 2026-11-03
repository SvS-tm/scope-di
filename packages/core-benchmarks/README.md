<p align="center">
    <img src="./docs/assets/readme-banner.svg" alt="scope-di Benchmarks" width="100%" />
</p>

This page is for developers evaluating whether `scope-di` is a good fit for an application. It focuses on comparable dependency injection behavior: warm resolution, cold resolution, transient graphs, cached graphs, registration, speed, and memory.


## Runtime Setup

Run `pnpm build-all` before benchmarking so the runner uses the current package builds. On Windows, `pnpm bench:json:complete` writes results under `results/<COMPUTERNAME>/`.

Module isolation and runtime code generation are independent flags. With both enabled, the DI engine chooses the strategy. That choice is an implementation detail that may change between releases.

The `scope-di-module-reload` and `scope-di-module-reload-codegen` cases initialize scopes with `await builder.setAllowRuntimeModuleIsolation(true).build()`. Every existing warm resolution workload runs in all four Scope DI modes: both flags off, code generation only, module isolation only, and both flags on. All modes reuse the same workload builders. Combined mode follows the library's strategy selection; it does not apply both mechanisms to every descriptor. Initialization happens outside the timed callback. Module isolation requires the emitted files under `dist/chunks` to remain available at runtime.

Benchmarks run on Node.js, Bun, and Deno. The repository pins the runtime versions and pnpm, which downloads the required runtimes automatically during installation. This keeps benchmark runs consistent across machines without relying on globally installed runtime versions.

Each machine has its own JSON results and Markdown reports, including the runtime versions used for that run. Updating the pinned runtimes does not change existing results; reports are refreshed when benchmarks are rerun on that machine.

Fast, filtered, and complete runs start a fresh worker process for each repetition of a benchmark case. A case is one scenario, one library, and one optimization configuration. Each case runs five times by default. Use `--repetitions=N` to change that count. Workers run sequentially, reversing case order on alternate rounds. Complete runs show total completed worker runs across all runtimes and libraries, alongside the current library counter and elapsed time. Resuming counts reused batches as completed; elapsed time starts from the new command. Console and Markdown comparisons use the median of process medians and show their range; allocations use the median of process allocation averages. JSON retains every process measurement. A fresh worker process prevents earlier cases from influencing the engine's optimization history. Measurements can still vary with warmup, garbage collection, and machine load.

Progress messages carry UTC timestamps. Each worker reports START, DONE, or FAILED with the active case, total completed work, total elapsed time, and case elapsed time. Resolution workers also report SETUP, MEASURING, and MEASURED so a stall can be distinguished between setup and calibration/timing/GC. Progress is logged at case boundaries and worker stage changes, outside the measured callback. Total progress includes startup workers, and a case counts as completed only after its worker succeeds.

After an interrupted complete run, `pnpm bench:json:complete --resume` reuses completed library JSON files in the output directory. Use it only when benchmark code, dependencies, and runtime versions are unchanged; a normal run always measures everything again.

Raw worker results are saved under `dist/isolated-runs` for inspection. Resume reruns incomplete library batches from the beginning. Fast mode selects a subset of warm cases and the internal diagnostics. For example, `pnpm bench:tsx:fast --filter=warmResolveTransientFactoryWith --repetitions=5` selects the five-, six-, ten-dependency, and changing-shape cases.

Any warning emitted during a worker measurement rejects that result. Code generation or module isolation falling back cannot silently produce a timing under the requested mode's name.

### Startup measurements

An unfiltered `pnpm bench:json:complete` run also measures Scope DI startup on Node, Bun, and Deno. Each runtime gets a separate `.startup.json` file and `.startup.md` report alongside its resolution results. Startup uses five workloads in all four modes and five repetitions by default. Each worker registers and builds exactly one scope. Process launch and initial package imports are excluded; registration, build, and their combined elapsed times are recorded separately in milliseconds. These are single fresh-process observations, not calibrated Mitata resolution measurements or competitor rankings. The existing registration cases remain the competitor setup comparison.

To run startup alone, use `pnpm bench:tsx:json:complete --startup`, or the equivalent Bun/Deno command. `--repetitions=N` controls the number of independent measurements. Startup is measured afresh even with `--resume`; filtered resolution runs skip it.

A fresh process avoids accumulating the unique module instances retained by runtime module caches. The repeated cold-resolution cases still cover flags-off and codegen modes only. Startup exposes isolation setup cost without placing unbounded module loading inside Mitata's calibration loop. It does not measure first resolution, async dependency resolution, or retained module memory.

## Compared Libraries

Each worker measures only its selected case. Comparison tables are assembled afterward from the independent measurements.

`pnpm bench:json:complete` runs every library on Node.js, Bun, and Deno. Alongside each runtime's combined JSON and Markdown report, a matching directory contains the individual library JSON files. The report links to these raw results.

For a single library, the runtime scripts accept an explicit selection, for example `pnpm bench:tsx:fast --library=inversify`. The same `--library` option works with the Bun and Deno scripts. An optional `--filter=warmResolveValue` narrows the scenarios being measured.

| Library | Package | Primary style |
| --- | --- | --- |
| scope-di | `@svs-tm/scope-di` | Explicit typed builder, key-based resolution. |
| Inversify | `inversify` | Decorator/metadata-oriented container. |
| TSyringe | `tsyringe` | Decorator/metadata-oriented container. |
| Awilix | `awilix` | Registration container with resolver helpers. |
| TypeDI | `typedi` | Decorator/metadata-oriented container. |
| Typed Inject | `typed-inject` | Token-based typed injection. |
| Needle DI | `@needle-di/core` | Token/provider-based injection. |

Complete runs include the following Scope DI configurations.

| Configuration | Runtime code generation | Module isolation | Coverage |
| --- | --- | --- | --- |
| `scope-di` | Off | Off | Registration, warm and cold resolution, startup |
| `scope-di-codegen` | On | Off | Registration, warm and cold resolution, startup |
| `scope-di-module-reload` | Off | On | Warm resolution, startup |
| `scope-di-module-reload-codegen` | On | On | Warm resolution, startup |

Inversify runs as `inversify` with JIT disabled (`jitless: true`) and `inversify-jit` with JIT enabled (`jitless: false`) for registration and warm and cold resolution. The shared Mitata `codeGeneration` parameter controls Scope DI code generation and Inversify JIT. Scope DI module isolation is configured separately.

The main JSON results and Markdown speed and allocation tables list each configuration for the cases it runs. Scope DI startup results have [separate reports](#startup-measurements).

The other libraries use their existing configurations; their installed public APIs expose no equivalent code-generation toggle. Enabling a flag does not guarantee that a particular scenario uses generated code. Some scenarios exercise cached values or strategies that do not use code generation. Inversify's JIT option controls its generated resolution machinery, while scope-di currently generates instantiation strategies, so these are library-specific optimizations rather than identical mechanisms.

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
| Async dependencies | No | The resolution cases are synchronous. |
| Collection registrations | No | Collection lookup and resolution appear in Scope DI diagnostics. |
| Scope inheritance | No | `scope-di`-specific behavior, not a fair competitor case. |

## How To Read The Numbers

Prefer warm resolution results when thinking about normal application runtime. In most applications, the container is configured once and dependencies are resolved many times.

Cold resolution is useful when a library creates many short-lived containers or request-level scopes. It should not be mixed with registration benchmarks.

Registration numbers are interesting for startup-heavy systems, serverless cold starts, tests that create many containers, and tools that dynamically compose graphs. They are usually less important than runtime resolution for long-lived applications.

Allocation estimates help compare work within a runtime. Bun uses a different heap measurement from Node.js and Deno. The estimates exclude retained module and code memory.

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
| `warmResolveTransientFactoryWithChangingShape` | Resolve a transient factory that cycles through six object shapes. Each call returns a fresh object with two numeric fields. |
| `warmResolveTransientFactoryChain` | Resolve a chain of three transient factories. |
| `warmResolveTransientFactoryWithFiveDependencies` | Resolve a transient factory with five direct dependencies. |
| `warmResolveTransientFactoryWithSixDependencies` | Resolve a transient factory with six direct dependencies. |
| `warmResolveTransientFactoryDeepChain` | Resolve five transient factories in a chain with a transient class at the leaf. |
| `warmResolveTransientFactoryWithTenDependencies` | Resolve a transient factory with ten direct dependencies. |
| `warmResolveTransientFactoryDeepWideGraph` | Resolve a transient root factory with five transient factory branches and 25 transient class leaves. |
| `warmResolveCachedFactoryWideGraph` | Create a transient root factory with ten cached singleton class dependencies. |
| `warmResolveCachedFactoryDeepWideGraph` | Create transient root and intermediate factories with cached singleton class leaves. |

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

Each registration measurement configures a fresh container with a batch of 300 registrations by default. The reported time covers the whole batch. The Scope DI case includes `build()`. The runtime scripts accept `--iterations=N` to change the batch size.

| Scenario | Description |
| --- | --- |
| `registrationClass` | Register a class dependency. |
| `registrationValue` | Register a value dependency. |
| `registrationFactory` | Register a factory dependency. |

### Startup Workloads

| Scenario | Description |
| --- | --- |
| `transientClass` | Register and build a scope with one transient class. |
| `factoryFiveDependencies` | Register and build a transient factory graph with five direct dependencies. |
| `factoryTenDependencies` | Register and build a transient factory graph with ten direct dependencies. |
| `factoryDeepWideGraph` | Register and build the deep-wide graph with transient leaves. |
| `cachedFactoryDeepWideGraph` | Register and build the deep-wide graph with singleton leaves. |

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
| `diagnostics:scope-di:resolveColdValue` | Build a fresh scope and resolve a value once in the timed callback. |
| `diagnostics:scope-di:findResolvedValueMiss` | Value cache miss lookup. |
| `diagnostics:scope-di:findResolvedValueHit` | Value cache hit lookup. |
| `diagnostics:scope-di:resolveCachedThreeValues` | Cached range resolution for three keys. |
| `diagnostics:scope-di:resolveCachedFiveValues` | Cached range resolution for five keys. |
| `diagnostics:scope-di:resolveCachedSixValues` | Cached range resolution for six keys. |
| `diagnostics:scope-di:resolveCollectionValues` | Collection value resolution. |
| `diagnostics:scope-di:resolveTransientFactoryWithFiveDependencies` | Transient factory path with five dependencies. |
| `diagnostics:scope-di:resolveTransientFactoryWithSixDependencies` | Transient factory path with six dependencies. |
| `diagnostics:scope-di:createChildScope` | Child scope creation. |
| `diagnostics:scope-di:disposeEmptyScope` | Build and dispose an empty scope in the timed callback. |
| `diagnostics:scope-di:disposeResolvedSingleton` | Build a scope, resolve a disposable singleton, and dispose the scope in the timed callback. |

## Fairness Notes

The public comparison uses idiomatic APIs for each library where possible. Some libraries resolve by token, some by string key, some through metadata, and some through factory functions. The benchmark names describe the behavior being measured rather than claiming identical internal mechanics. Wide graphs and the deep chain use class providers at the leaves and factories above them. The shallow chain uses factories throughout. Every participating library uses the same changing-shape factory. Scope DI, Inversify, and Typed Inject declare factory dependencies explicitly. TSyringe and TypeDI factories perform container lookups, while Awilix uses its default proxy injection mode. These API differences are part of the measured resolution cost.

Needle DI participates only in registration, value resolution, and singleton resolution: its installed API does not provide an equivalent transient lifetime. TypeDI uses standalone container instances so repeated setup does not accumulate globally retained containers. Registration includes each library's normal setup work, including Scope DI's build step; work deferred until first resolution is measured by cold resolution instead. Warm resolution performs one initial resolution before timing.

Public charts should compare only equivalent scenarios. `scope-di`-specific features such as inherited scopes and typed collection inference should be documented as library features, not benchmarked as competitor cases unless another library exposes a direct equivalent.

## Actual Runs

### 13th Gen Intel(R) Core(TM) i9-13900HX, Windows 10.0.26300 x64, 300 Registrations per Batch

Commit: [7de000ef198459b0a478103290b40a43dc266e0e](https://github.com/SvS-tm/scope-di/commit/7de000ef198459b0a478103290b40a43dc266e0e)

Statistics:

- Module isolation alone had the fastest median for warm deep-wide transient resolution on Node.js and Deno. Combined mode had similar medians on both runtimes.
- On Node.js, isolation reduces the warm deep-wide graph from about 543 ns to 165 ns per resolution. Registering and building that graph takes about 23.7 ms with isolation enabled, up from 0.54 ms with both flags off.
- On Bun, code generation alone had the fastest medians among Scope DI modes for the six- and ten-dependency warm transient factory cases.
- A Scope DI configuration had the fastest median for warm deep-wide transient resolution on each of the three runtimes. Typed Inject had the fastest median for warm value lookup on each runtime.

| Runtime | Version | Report | Startup |
| --- | --- | --- | --- |
| Node.js | `v26.11.1` | [Node.js report](./results/ALIEN/bench_node_json_complete.md) | [Startup report](./results/ALIEN/bench_node_json_complete.startup.md) |
| Bun | `1.4.2` | [Bun report](./results/ALIEN/bench_bun_json_complete.md) | [Startup report](./results/ALIEN/bench_bun_json_complete.startup.md) |
| Deno | `2.9.6` | [Deno report](./results/ALIEN/bench_deno_json_complete.md) | [Startup report](./results/ALIEN/bench_deno_json_complete.startup.md) |

### AMD Ryzen 7 3800X 8-Core Processor, Windows 10.0.22631 x64, 300 Registrations per Batch

Commit: [7de000ef198459b0a478103290b40a43dc266e0e](https://github.com/SvS-tm/scope-di/commit/7de000ef198459b0a478103290b40a43dc266e0e)

Statistics:

- Module isolation alone had the fastest median among Scope DI modes for warm deep-chain resolution on Node.js and Deno.
- On Deno, isolation reduces warm deep-chain resolution from about 220 ns to 50 ns. For the deep-wide graph, combined mode reduces warm resolution from about 930 ns to 360 ns and raises registration and build time from 1.48 ms to 22.56 ms.
- A Scope DI configuration had the fastest median for warm deep-wide transient resolution on each of the three runtimes. Typed Inject had the fastest medians for warm value and singleton lookups. On Deno, its warm singleton class lookup had a median of 8.0 ns, with process medians ranging from 1.0 to 8.3 ns.
- Code generation improves warm wide transient calls but increases the cost of first resolution from a fresh scope.
- Bun allocation measurements are runtime-specific heap estimates.

| Runtime | Version | Report | Startup |
| --- | --- | --- | --- |
| Node.js | `v26.11.1` | [Node.js report](./results/BONI/bench_node_json_complete.md) | [Startup report](./results/BONI/bench_node_json_complete.startup.md) |
| Bun | `1.4.2` | [Bun report](./results/BONI/bench_bun_json_complete.md) | [Startup report](./results/BONI/bench_bun_json_complete.startup.md) |
| Deno | `2.9.6` | [Deno report](./results/BONI/bench_deno_json_complete.md) | [Startup report](./results/BONI/bench_deno_json_complete.startup.md) |

## License

<p>
    <a href="../../LICENSE"><img src="../../docs/assets/logo.svg" alt="scope-di logo" width="32" /></a>
    <br />
    <a href="../../LICENSE">MIT</a>
</p>
