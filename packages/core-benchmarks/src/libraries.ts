export const libraryNames =
[
    "scope-di",
    "inversify",
    "tsyringe",
    "awilix",
    "typedi",
    "typed-inject",
    "needle-di"
] as const;

export type BenchmarkLibrary = typeof libraryNames[number];
