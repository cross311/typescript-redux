import {
  EntityCollection,
  entityCollectionDeletedState,
  entityCollectionInitialState,
  entityCollectionLoadedState,
  entityCollectionLoadingState,
  entityCollectionRequestedState,
  EntitySingle,
  entitySingleInitialState,
  FetchStatus,
  getEntitiesFromCollection,
  getEntityCollection,
  getEntityFromCollection,
  TestData,
} from "../";

TestData.registerDateNow();

const emptyObject = {};

describe("getEntityCollection", () => {
  it("should get the entity collection for test data", () => {
    const state = getEntityCollection(TestData.collections, TestData.testDataName);
    expect(
      state,
    ).toEqual(TestData.testDataCollection);
  });

  it("should get the empty entity collection for missing collection", () => {
    const state = getEntityCollection(TestData.collections, "not found");
    expect(
      state,
    ).toEqual(entityCollectionInitialState());
  });
});

describe("getEntityFromCollection", () => {
  it("should get the loaded entity from test data", () => {
    const state = getEntityFromCollection(TestData.testDataCollection, FetchStatus.LOADED);
    expect(
      state.fetchStatus,
    ).toEqual(FetchStatus.LOADED);
  });

  it("should get the empty entity for missing entities", () => {
    const state = getEntityFromCollection(TestData.testDataCollection, "not found");
    const expectedState = entitySingleInitialState();

    TestData.expectEntitySinglesToBeEqual(
      state,
      expectedState,
    );
  });
});

describe("getEntitiesFromCollection", () => {
  let state: Array<EntitySingle<TestData.TestType>>;
  beforeEach(() => {
    state = getEntitiesFromCollection(TestData.testDataCollection, [FetchStatus.LOADED, FetchStatus.LOADING]);
  });

  it("should get the loaded entity from test data", () => {
    expect(
      state[0].fetchStatus,
    ).toEqual(FetchStatus.LOADED);
  });

  it("should get the loading entity from test data", () => {
    expect(
      state[1].fetchStatus,
    ).toEqual(FetchStatus.LOADING);
  });
});

describe("entityCollectionInitialState", () => {
  let state: EntityCollection<{}>;
  beforeEach(() => {
    state = entityCollectionInitialState();
  });

  it("should initialize error to empty object", () => {
    expect(
      state.error,
    ).toEqual(emptyObject);
  });

  it("should initialize fetchStatus to empty object", () => {
    expect(
      state.fetchStatus,
    ).toEqual(emptyObject);
  });

  it("should initialize values to empty object", () => {
    expect(
      state.values,
    ).toEqual(emptyObject);
  });

  it("should initialize requestedAt to empty object", () => {
    expect(
      state.requestedAt,
    ).toEqual(emptyObject);
  });

  it("should initialize loadedAt to empty object", () => {
    expect(
      state.loadedAt,
    ).toEqual(emptyObject);
  });
});

describe("entityCollectionLoadingState", () => {
  let collection: EntityCollection<TestData.TestType>;
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    collection = entityCollectionLoadingState(TestData.testDataCollection, FetchStatus.NONE);
    state = getEntityFromCollection(collection, FetchStatus.NONE);
  });

  it("should initialize error to be undefined", () => {
    expect(
      state.error,
    ).toBeUndefined();
  });

  it("should initialize fetchStatus to loading", () => {
    expect(
      state.fetchStatus,
    ).toEqual(FetchStatus.LOADING);
  });

  it("should initialize values to undefined", () => {
    expect(
      state.value,
    ).toBeUndefined();
  });

  it("should initialize requestedAt to be now", () => {
    expect(
      state.requestedAt,
    ).toEqual(TestData.dateNowTime);
  });

  it("should initialize loadedAt to be undefined", () => {
    expect(
      state.loadedAt,
    ).toBeUndefined();
  });
});

describe("entityCollectionLoadedState", () => {
  let collection: EntityCollection<TestData.TestType>;
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    collection = entityCollectionLoadedState(TestData.testDataCollection, FetchStatus.NONE, TestData.testData);
    state = getEntityFromCollection(collection, FetchStatus.NONE);
  });

  it("should initialize error to be undefined", () => {
    expect(
      state.error,
    ).toBeUndefined();
  });

  it("should initialize fetchStatus to loaded", () => {
    expect(
      state.fetchStatus,
    ).toEqual(FetchStatus.LOADED);
  });

  it("should initialize values to proper value", () => {
    expect(
      state.value,
    ).toEqual(TestData.testData);
  });

  it("should initialize requestedAt to be now", () => {
    expect(
      state.requestedAt,
    ).toEqual(TestData.dateNowTime);
  });

  it("should initialize loadedAt to be now", () => {
    expect(
      state.loadedAt!,
    ).toEqual(TestData.dateNowTime);
  });

  describe("with error payload", () => {
    const error = new Error();
    beforeEach(() => {
      collection = entityCollectionLoadedState(TestData.testDataCollection, FetchStatus.NONE, error);
      state = getEntityFromCollection(collection, FetchStatus.NONE);
    });

    it("should initialize error to be error", () => {
      expect(
        state.error,
      ).toEqual(error);
    });

    it("should initialize values to be undefined", () => {
      expect(
        state.value,
      ).toBeUndefined();
    });
  });
});

describe("entityCollectionRequestedState", () => {
  let collection: EntityCollection<TestData.TestType>;
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    collection = entityCollectionRequestedState(TestData.testDataCollection, FetchStatus.NONE);
    state = getEntityFromCollection(collection, FetchStatus.NONE);
  });

  it("should not touch error", () => {
    expect(
      state.error,
    ).toBeUndefined();
  });

  it("should not touch error", () => {
    expect(
      state.fetchStatus,
    ).toEqual(FetchStatus.NONE);
  });

  it("should not touch error", () => {
    expect(
      state.value,
    ).toBeUndefined();
  });

  it("should initialize requestedAt to be now", () => {
    expect(
      state.requestedAt,
    ).toEqual(TestData.dateNowTime);
  });

  it("should not touch error", () => {
    expect(
      state.loadedAt,
    ).toBeUndefined();
  });
});

describe("entityCollectionDeletedStated", () => {
  let collection: EntityCollection<TestData.TestType>;
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    collection = entityCollectionDeletedState(TestData.testDataCollection, FetchStatus.LOADED);
    state = getEntityFromCollection(collection, FetchStatus.LOADED);
  });

  it("should reset error to be undefined", () => {
    expect(
      state.error,
    ).toBeUndefined();
  });

  it("should reset fetchStatus to none", () => {
    expect(
      state.fetchStatus,
    ).toEqual(FetchStatus.NONE);
  });

  it("should reset values to undefined", () => {
    expect(
      state.value,
    ).toBeUndefined();
  });

  it("should reset requestedAt to be now", () => {
    expect(
      state.requestedAt,
    ).toEqual(TestData.dateNowTime);
  });

  it("should reset loadedAt to be undefined", () => {
    expect(
      state.loadedAt,
    ).toBeUndefined();
  });
});

describe("expectEntityCollectionsToBeEqual", () => {
  it("should tell that entity collecions are equal", () => {
    TestData.expectEntityCollectionsToBeEqual(
      TestData.testDataCollection,
      TestData.testDataCollection,
    );
  });
});
