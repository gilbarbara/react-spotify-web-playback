import '@testing-library/jest-dom';

import * as matchers from 'jest-extended';
import { enableFetchMocks } from 'jest-fetch-mock';

expect.extend(matchers);
enableFetchMocks();
