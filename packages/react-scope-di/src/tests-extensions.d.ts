import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "expect"
{
    interface Matchers<R = void | Promise<void>, T = unknown> extends TestingLibraryMatchers<ReturnType<typeof expect.stringContaining>, R> 
    { 
        toHaveBeenCalledWithContext(expected: unknown): R;
    }
}
