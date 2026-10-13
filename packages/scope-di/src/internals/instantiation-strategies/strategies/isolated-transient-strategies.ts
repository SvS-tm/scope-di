/**
 * @note Load a separate module instance per transient descriptor to isolate construction and disposal feedback.
 * Keep these internal modules exclusive to this entry so Rollup retains their hot paths in its chunk.
 */
export * from "./sync/isolated/class/create-class-strategy";
export * from "./sync/isolated/factory/create-factory-strategy";
export { createAsyncClassStrategy } from "./async/isolated/class/create-async-class-strategy";
export { createAsyncFactoryStrategy } from "./async/isolated/factory/create-async-factory-strategy";
