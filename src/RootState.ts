import {
  combineReducers,
  Reducer,
} from "redux";

import {
  EntitySingle, EntitySinglesState,
} from "./EntitySingle";

import {
  EntityCollection, EntityCollectionsState,
} from "./EntityCollection";

export interface EntitiesState {
  singles: EntitySinglesState;
  collections: EntityCollectionsState;
}

export interface PagesState {
  [pageName: string]: any;
}

export interface RootState {
  entities: EntitiesState;
  pages: PagesState;
}

export function initialState(): RootState {
  return {
    entities: {
      singles: {},
      collections: {},
    },
    pages: {},
  };
}

/**
 * Selector for reselect to get entities
 * @param state RootState
 */
export function getEntities(state: RootState): EntitiesState {
  return state.entities;
}

/**
 * Selector for reselect to get pages
 * @param state RootState
 */
export function getPages(state: RootState): PagesState {
  return state.pages;
}

/**
 * Selector for reselect to get entity single from entities select
 * @param state EntitiesState
 */
export function getSingles(state: EntitiesState): EntitySinglesState {
  return state.singles;
}

/**
 * Selector for reselect to get entity collection from entities select
 * @param state EntitiesState
 */
export function getCollections(state: EntitiesState): EntityCollectionsState {
  return state.collections;
}

/**
 * Selector for reselect to get page from pages select
 * @param state PagesState
 * @param pageName name of page to try and get
 */
export function getPage<T>(state: PagesState, pageName: string): T {
  const page: T = state[pageName];
  return page;
}

export interface RootStateReducers {
  singles?: {[name: string]: Reducer<EntitySingle<any>>};
  collections?: {[name: string]: Reducer<EntityCollection<any>>};
  pages?: {[name: string]: Reducer<any>};
}

export function combineRootStateReducers(reducers: RootStateReducers[]): RootStateReducers {
  const initial: RootStateReducers = {
    singles: {},
    collections: {},
    pages: {},
  };

  return reducers.reduce((acc, reducer): RootStateReducers => {
    return {
      singles: {
        ...acc.singles!,
        ...reducer.singles!,
      },
      collections: {
        ...acc.collections!,
        ...reducer.collections!,
      },
      pages: {
        ...acc.pages!,
        ...reducer.pages!,
      },
    };
  }, initial);
}

export function buildRootState(reducers: RootStateReducers) {
  const singles = combineReducers<EntitySinglesState>(reducers.singles!);

  const collections = combineReducers<EntityCollectionsState>(reducers.collections!);

  const pages = combineReducers<PagesState>(reducers.pages!);

  const entities = combineReducers<EntitiesState>({
    singles,
    collections,
  });

  const rootState = {
    entities,
    pages,
  };

  return rootState;
}
