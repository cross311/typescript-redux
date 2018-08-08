import { combineReducers } from "redux";
import {
  Action,
  buildRootState,
  combineRootStateReducers,
  EntityCollection,
  entityCollectionInitialState,
  EntitySingle,
  entitySingleInitialState,
  initialState,
  RootStateReducers,
} from "../";

describe("RootState", () => {
  it("should build root state", () => {
    const base: RootStateReducers = {
      singles: { base: (state: EntitySingle<{}> = entitySingleInitialState(), action: Action<{}>) => state },
      collections: { base: (state: EntityCollection<{}> = entityCollectionInitialState(), action: Action<{}>) => state },
      pages: { base: (state: {} = {}, action: Action<{}>) => state },
    };

    const otherReducers: RootStateReducers = {
      pages: {
        base: (state: {} = {}, action: Action<{}>) => state,
      },
    };

    const rootState = buildRootState(combineRootStateReducers([
      base,
      otherReducers,
    ]));

    expect(rootState).toMatchSnapshot();
  });

  it("should give an empty initial state", () => {
    expect(initialState()).toEqual({
      entities: {
        singles: {},
        collections: {},
      },
      pages: {},
    });
  });
});
