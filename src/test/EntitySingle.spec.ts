import {
  EntitySingle,
  entitySingleDeletedState,
  entitySingleInitialState,
  entitySingleLoadedState,
  entitySingleLoadingState,
  entitySingleRequestedState,
  FetchStatus,
  getEntitySingle,
  hasError,
  hasSomethingToShow,
  isLoaded,
  isLoading,
} from "../";

import * as TestData from "../test-data";

TestData.registerDateNow();

describe("getEntitySingle", () => {
  it("should get the entity single for test data", () => {
    const state = getEntitySingle(TestData.singles, FetchStatus.LOADED);
    expect(
      state,
    ).toEqual(TestData.singles[FetchStatus.LOADED]);
  });

  it("should get the empty entity collection for missing collection", () => {
    const state = getEntitySingle(TestData.singles, "not found");
    const expectedState = entitySingleInitialState();

    TestData.expectEntitySinglesToBeEqual(
      state,
      expectedState,
    );
  });

  it("should Math.floor loadedAt", () => {
    const state = getEntitySingle(TestData.singles, "not found");
    state.loadedAt = Date.now();
    const expectedState = entitySingleInitialState();
    expectedState.loadedAt = Date.now() + 1;

    TestData.expectEntitySinglesToBeEqual(
      state,
      expectedState,
    );
  });
});

describe("entitySingleInitialState", () => {
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    state = entitySingleInitialState();
  });

  it("should initialize error to undefined", () => {
    expect(
      state.error,
    ).toBeUndefined();
  });

  it("should initialize fetchStatus to none", () => {
    expect(
      state.fetchStatus,
    ).toEqual(FetchStatus.NONE);
  });

  it("should initialize values to undefined", () => {
    expect(
      state.value,
    ).toBeUndefined();
  });

  it("should initialize requestedAt to now", () => {
    expect(
      state.requestedAt,
    ).toEqual(TestData.dateNowTime);
  });

  it("should initialize loadedAt to undefined", () => {
    expect(
      state.loadedAt,
    ).toBeUndefined();
  });
});

describe("entitySingleLoadingState", () => {
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    state = entitySingleLoadingState();
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

describe("entitySingleLoadedState", () => {
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    state = entitySingleLoadedState(TestData.testData);
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
      state = entitySingleLoadedState<TestData.TestType>(error);
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

describe("entitySingleRequestedState", () => {
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    state = entitySingleRequestedState(TestData.singles[FetchStatus.NONE]!);
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

describe("entitySingleDeletedStated", () => {
  let state: EntitySingle<TestData.TestType>;
  beforeEach(() => {
    state = entitySingleDeletedState();
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

describe("isLoading", () => {
  it("should return true for fetch status of loading", () => {
    expect(
      isLoading(TestData.singles[FetchStatus.LOADING]!),
    ).toBe(true);
  });

  it("should return false for fetch status of loaded", () => {
    expect(
      isLoading(TestData.singles[FetchStatus.LOADED]!),
    ).toBe(false);
  });

  it("should return false for fetch status of none", () => {
    expect(
      isLoading(TestData.singles[FetchStatus.NONE]!),
    ).toBe(false);
  });
});

describe("isLoaded", () => {
  it("should return true for fetch status of loaded", () => {
    expect(
      isLoaded(TestData.singles[FetchStatus.LOADED]!),
    ).toBe(true);
  });
  it("should return false for fetch status of Loading or Non", () => {
    expect(
      isLoaded(TestData.singles[FetchStatus.LOADING]!),
    ).toBe(false);
    expect(
      isLoaded(TestData.singles[FetchStatus.NONE]!),
    ).toBe(false);
  });
});

describe("hasSomethingToShow", () => {
  it("should return false for fetch status of loading", () => {
    expect(
      hasSomethingToShow(TestData.singles[FetchStatus.LOADING]!),
    ).toBe(false);
  });

  it("should return true for fetch status of loaded", () => {
    expect(
      hasSomethingToShow(TestData.singles[FetchStatus.LOADED]!),
    ).toBe(true);
  });

  it("should return false for fetch status of none", () => {
    expect(
      hasSomethingToShow(TestData.singles[FetchStatus.NONE]!),
    ).toBe(false);
  });
});

describe("hasError", () => {
  it("should return false for fetch status of loading", () => {
    expect(
      hasError(TestData.singles[FetchStatus.LOADING]!),
    ).toBe(false);
  });

  it("should return true for loaded with error", () => {
    expect(
      hasError(entitySingleLoadedState(new Error("test"))),
    ).toBe(true);
  });

  it("should return false for fetch status of none", () => {
    expect(
      hasError(TestData.singles[FetchStatus.NONE]!),
    ).toBe(false);
  });
});
