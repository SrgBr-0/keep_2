import { RestDataProvider } from '../index.js';
import type { RemultServerOptions } from './index.js';
export declare function TestApiDataProvider(options?: Pick<RemultServerOptions<unknown>, 'ensureSchema' | 'dataProvider'>): RestDataProvider;
