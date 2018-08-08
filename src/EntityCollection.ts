import {
  deletedState as entitySingleDeletedStated,
  EntitySingle,
  initialState as entitySingleInitialState,
  loadedState as entitySingleLoadedState,
  loadingState as entitySingleLoadingState,
  requestedState as entitySingleRequestedState,
} from "./EntitySingle";
import { FetchStatus } from "./FetchStatus";

export interface EntityIdMap<T> {
  [entityId: string]: T | undefined;
}

export interface EntityCollection<T> {
  values: EntityIdMap<T>;
  fetchStatus: EntityIdMap<FetchStatus>;
  requestedAt: EntityIdMap<number>;
  loadedAt: EntityIdMap<number>;
  error: EntityIdMap<Error>;
}

export interface EntityCollectionsState {
  [entityName: string]: EntityCollection<any>;
}

export function initialState<T>(): EntityCollection<T> {
  const state: EntityCollection<T> = {
    values: {},
    fetchStatus: {},
    requestedAt: {},
    loadedAt: {},
    error: {},
  };

  return state;
}

function fromBaseState<T>(
  currentState: EntityCollection<T>,
  baseState: EntitySingle<T>,
  entityId: string,
): EntityCollection<T> {
  const state: EntityCollection<T> = {
    values: {
      ...currentState.values,
      [entityId]: baseState.value,
    },
    fetchStatus: {
      ...currentState.fetchStatus,
      [entityId]: baseState.fetchStatus,
    },
    requestedAt: {
      ...currentState.requestedAt,
      [entityId]: baseState.requestedAt,
    },
    loadedAt: {
      ...currentState.loadedAt,
      [entityId]: baseState.loadedAt,
    },
    error: {
      ...currentState.error,
      [entityId]: baseState.error,
    },
  };

  return state;
}

export function loadingState<T>(
  currentState: EntityCollection<T>,
  entityId: string,
): EntityCollection<T> {
  return fromBaseState<T>(currentState, entitySingleLoadingState<T>(), entityId);
}

export function loadedState<T>(
  currentState: EntityCollection<T>,
  entityId: string,
  valueOrError: T | Error,
): EntityCollection<T> {
  return fromBaseState<T>(currentState, entitySingleLoadedState<T>(valueOrError), entityId);
}

export function requestedState<T>(currentState: EntityCollection<T>, entityId: string): EntityCollection<T> {
  return fromBaseState<T>(
    currentState,
    entitySingleRequestedState<T>(
      getEntity<T>(currentState, entityId),
    ),
    entityId,
  );
}

export function deletedState<T>(
  currentState: EntityCollection<T>,
  entityId: string,
): EntityCollection<T> {
  return fromBaseState<T>(currentState, entitySingleDeletedStated<T>(), entityId);
}

export function getEntityCollection<T>(
  state: EntityCollectionsState,
  entityName: string,
): EntityCollection<T> {
  const collection: EntityCollection<T> | undefined = state[entityName];
  if (collection === undefined) { return initialState(); }
  return collection;
}

export function getEntity<T>(
  state: EntityCollection<T>,
  entityId: string,
): EntitySingle<T> {
  const baseState = entitySingleInitialState<T>();
  const entity: EntitySingle<T> = {
    value: state.values[entityId] || baseState.value,
    fetchStatus: state.fetchStatus[entityId] || baseState.fetchStatus,
    requestedAt: state.requestedAt[entityId] || baseState.requestedAt,
    loadedAt: state.loadedAt[entityId] || baseState.loadedAt,
    error: state.error[entityId] || baseState.error,
  };
  return entity;
}

export function getEntities<T>(
  state: EntityCollection<T>,
  entityIds: string[],
): Array<EntitySingle<T>> {
  return entityIds.map((entityId: string): EntitySingle<T> => getEntity<T>(state, entityId));
}
