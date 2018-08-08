import { FetchStatus } from "./FetchStatus";

import * as RootState from "./RootState";

import * as EntitySingle from "./EntitySingle";

import * as EntityCollection from "./EntityCollection";

export interface TestType {
  test: boolean;
}

export const dateNowTime = Date.now();
export const dateNow = () => dateNowTime;

export function registerDateNow() {
  let oldNow;
  beforeEach(() => {
    oldNow = Date.now;
    Date.now = dateNow;
  });
  afterEach(() => {
    Date.now = oldNow;
  });
}

export const testDataName = "test_data";
export const testData: TestType = {
  test: true,
};
export const testDataCollection: EntityCollection.EntityCollection<TestType> =
  EntityCollection.deletedState<TestType>(
    EntityCollection.loadedState<TestType>(
      EntityCollection.loadingState<TestType>(
        EntityCollection.initialState<TestType>(),
        FetchStatus.LOADING,
      ),
      FetchStatus.LOADED,
      testData,
    ),
    FetchStatus.NONE,
  );

export const singles: EntitySingle.EntitySinglesState = {
  [FetchStatus.NONE]: EntitySingle.initialState<TestType>(),
  [FetchStatus.LOADING]: EntitySingle.loadingState<TestType>(),
  [FetchStatus.LOADED]: EntitySingle.loadedState<TestType>(testData),
};

export const collections: EntityCollection.EntityCollectionsState = {
  [testDataName]: testDataCollection,
};

export const entities: RootState.EntitiesState = {
  singles,
  collections,
};

export const pages: RootState.PagesState = {
  [testDataName]: testData,
};

export const rootState: RootState.RootState = {
  entities,
  pages,
};

export function expectEntitySinglesToBeEqual<T>(
  actual: EntitySingle.EntitySingle<T>,
  expected: EntitySingle.EntitySingle<T>,
) {
  actual.requestedAt = Math.floor(actual.requestedAt / 100);
  actual.loadedAt = actual.loadedAt ? Math.floor(actual.loadedAt / 100) : undefined;
  expected.requestedAt = Math.floor(expected.requestedAt / 100);
  expected.loadedAt = expected.loadedAt ? Math.floor(expected.loadedAt / 100) : undefined;

  expect(
    actual,
  ).toEqual(expected);
}

export function expectEntityCollectionsToBeEqual<T>(
  actual: EntityCollection.EntityCollection<T>,
  expected: EntityCollection.EntityCollection<T>,
) {
  Object.keys(expected.values)
    .map((id) => {
      const actualRequested = actual.requestedAt[id]!;
      const actualLoaded = actual.loadedAt[id]!;
      const expectedRequested = expected.requestedAt[id]!;
      const expectedLoaded = expected.loadedAt[id]!;
      actual.requestedAt[id] = Math.floor(actualRequested / 100);
      actual.loadedAt[id] = actualLoaded ? Math.floor(actualLoaded / 100) : undefined;
      expected.requestedAt[id] = Math.floor(expectedRequested / 100);
      expected.loadedAt[id] = expectedLoaded ? Math.floor(expectedLoaded / 100) : undefined;
    });

  expect(
    actual,
  ).toEqual(expected);
}
