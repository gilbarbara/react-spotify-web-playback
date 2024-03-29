import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
import * as matchers from 'jest-extended';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

configure({ testIdAttribute: 'data-component-name' });

expect.extend(matchers);

const fetchMock = createFetchMock(vi);

fetchMock.enableMocks();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
