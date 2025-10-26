import { expect } from '@jest/globals';
import matchers from '@testing-library/jest-dom/matchers';
import type { FunctionLike, Mock } from 'jest-mock';
import type { MatcherContext } from 'expect';

function isJestMock(value: any): value is Mock<FunctionLike>
{
    return typeof value === 'function' && value.mock && Array.isArray(value.mock.calls);
}

expect.extend(matchers);

expect.extend
(
    {
        toHaveBeenCalledWithContext(this: MatcherContext, received: unknown, expected: unknown) 
        {
            if (!isJestMock(received)) 
            {
                return {
                    pass: false,
                    message: () =>
                        `${this.utils.matcherHint('.toHaveBeenCalledWithContext')}\n\n` +
                        `Received value must be a Jest mock/spyon function.\n` +
                        `Received: ${this.utils.printReceived(received)}`
                };
            }

            const contexts = received.mock.contexts ?? [];

            const pass = contexts.some(context => this.equals(context, expected));

            const message = pass
                ? (
                    `${this.utils.matcherHint('.not.toHaveBeenCalledWithContext')}\n\n` +
                    `Expected mock NOT to have been called with context:\n  ${this.utils.printExpected(expected)}\n` +
                    `But it was. Contexts:\n  ${this.utils.printReceived(contexts)}`
                ) : (
                    `${this.utils.matcherHint('.toHaveBeenCalledWithContext')}\n\n` +
                    `Expected mock to have been called with context:\n  ${this.utils.printExpected(expected)}\n` +
                    `Received contexts:\n  ${this.utils.printReceived(contexts)}`
                );

            return { pass, message: () => message };
        }
    }
);
