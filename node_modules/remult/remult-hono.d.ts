import { type Context, type Env, Hono } from 'hono';
import type { BlankInput } from 'hono/types';
import { type RemultServerOptions, type RemultServerCore } from './server/index.js';
export declare function remultHono(options: RemultServerOptions<Context<Env, '', BlankInput>>): RemultHonoServer;
export type RemultHonoServer = Hono & RemultServerCore<Context<Env, '', BlankInput>> & {
    withRemult: <T>(c: Context<Env, '', BlankInput>, what: () => Promise<T>) => Promise<T>;
};
