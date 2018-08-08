import { FetchStatus } from "./FetchStatus";

export interface EntitySingle<T> {
  value?: T;
  fetchStatus: FetchStatus;
  requestedAt: number;
  loadedAt?: number;
  error?: Error;
}

export interface EntitySinglesState {
  [entityName: string]: EntitySingle<any> | undefined;
}

export function initialState<T>(value?: T): EntitySingle<T> {
  const state: EntitySingle<T> = {
    value: value || undefined,
    fetchStatus: FetchStatus.NONE,
    requestedAt: Date.now(),
    loadedAt: undefined,
    error: undefined,
  };
  return state;
}

export function loadingState<T>(): EntitySingle<T> {
  const state: EntitySingle<T> = {
    value: undefined,
    fetchStatus: FetchStatus.LOADING,
    requestedAt: Date.now(),
    loadedAt: undefined,
    error: undefined,
  };

  return state;
}

export function loadedState<T>(valueOrError: T | Error): EntitySingle<T> {
  const {
    value,
    error,
  } = valueOrError instanceof Error
    ? { value: undefined, error: valueOrError }
    : { value: valueOrError, error: undefined };
  const now = Date.now();
  const state: EntitySingle<T> = {
    value,
    fetchStatus: FetchStatus.LOADED,
    requestedAt: now,
    loadedAt: now,
    error,
  };

  return state;
}

export function requestedState<T>(currentState: EntitySingle<T>): EntitySingle<T> {
  return {
    ...currentState,
    requestedAt: Date.now(),
  };
}

export function deletedState<T>(): EntitySingle<T> {
  return initialState<T>();
}

export function getEntitySingle<T>(state: EntitySinglesState, entityName: string): EntitySingle<T> {
  const entitySingle: EntitySingle<T> | undefined = state[entityName];
  if (entitySingle === undefined) { return initialState<T>(); }
  return entitySingle;
}

export function isLoading<T>(entity: EntitySingle<T>): boolean {
  return entity.fetchStatus === FetchStatus.LOADING;
}

export function isLoaded<T>(entity: EntitySingle<T>): boolean {
  return entity.fetchStatus === FetchStatus.LOADED;
}

export function hasSomethingToShow<T>(entity: EntitySingle<T>): boolean {
  return entity.value !== undefined;
}

export function hasError<T>(entity: EntitySingle<T>): boolean {
  return entity.error !== undefined;
}
