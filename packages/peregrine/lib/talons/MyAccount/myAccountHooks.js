import { SyncHook, AsyncSeriesHook } from 'tapable';

export const syncOnSignOut = new SyncHook();

export const asyncOnSignOut = new AsyncSeriesHook();
