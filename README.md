<p align="center">
    <img src="./docs/assets/readme-banner.svg" alt="scope-di" width="100%" />
</p>

Type-safe dependency injection for TypeScript and extensions for it without decorators or `reflect-metadata`.

This repository contains the core DI package, extension packages, and benchmark reports for developers evaluating whether `scope-di` fits their application.

## Compatibility

`scope-di` packages support TypeScript 5 and TypeScript 6. Compile-time public API tests run against the latest supported TypeScript 5.x and 6.x compiler versions.

`@svs-tm/react-scope-di` supports React 18 and React 19.

## Packages

| Package | Purpose | Docs |
| --- | --- | --- |
| `@svs-tm/scope-di` | Core dependency injection library. | [Core README](./packages/scope-di/README.md) |
| `@svs-tm/react-scope-di` | HOC-first React dependency resolution, with hooks for advanced cases. | [React README](./packages/react-scope-di/README.md) |
| `@svs-tm/system` | Shared runtime helpers used by the DI packages. | Internal support package |
| `@svs-tm/core-benchmarks` | Benchmark report for core DI behavior. | [Benchmark report](./packages/core-benchmarks/README.md) |

## License

<p>
    <a href="./LICENSE"><img src="./docs/assets/logo.svg" alt="scope-di logo" width="32" /></a>
    <br />
    <a href="./LICENSE">MIT</a>
</p>
