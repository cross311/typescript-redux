import {
  createEntityCollectionSelector,
  createEntitySingleSelector,
  createPageSelector,
  entityCollectionInitialState,
  entitySingleInitialState,
} from "../index";

import { FetchStatus } from "../FetchStatus";
import * as TestData from "../test-data";

describe("createEntitySingleSelector", () => {
  it("should get the entity single for test data", () => {
    const state = createEntitySingleSelector(FetchStatus.LOADED)(TestData.rootState);
    expect(
      state,
    ).toEqual(TestData.singles[FetchStatus.LOADED]);
  });

  it("should get the empty entity collection for missing collection", () => {
    const state = createEntitySingleSelector("not found")(TestData.rootState);
    const expectedState = entitySingleInitialState();
    // delete requestedAt is always different due to when it was generated
    delete state.requestedAt;
    delete expectedState.requestedAt;
    expect(
      state,
    ).toEqual(expectedState);
  });
});

describe("createEntityCollectionSelector", () => {
  it("should get the entity collection for test data", () => {
    const state = createEntityCollectionSelector(TestData.testDataName)(TestData.rootState);
    expect(
      state,
    ).toEqual(TestData.testDataCollection);
  });

  it("should get the empty entity collection for missing collection", () => {
    const state = createEntityCollectionSelector("not found")(TestData.rootState);
    expect(
      state,
    ).toEqual(entityCollectionInitialState());
  });
});

describe("createPageSelector", () => {
  it("should get the page for test data", () => {
    const state = createPageSelector(TestData.testDataName)(TestData.rootState);
    expect(
      state,
    ).toEqual(TestData.testData);
  });
});
