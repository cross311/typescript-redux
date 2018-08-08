import {
  ActionType, BaseAction, hasErrorPayload, hasPayload, hasSuccessPayload, ResponseAction,
} from "../";

describe("ActionType", () => {
  const type = "TEST_TYPE";
  const payload: string = "test";
  let actionType: ActionType<string>;

  beforeEach(() => {
    actionType = new ActionType<string>(type);
  });

  it("should store passed in type to replace constant", () => {
    expect(
      actionType.type,
    ).toEqual(type);
  });

  describe("helpers", () => {
    let action0: BaseAction;
    let action1: ResponseAction<string>;
    let action2: ResponseAction<string>;

    beforeEach(() => {
       action0 = actionType.create();
       action1 = actionType.createResponse(payload);
       action2 = actionType.createResponse(new Error(payload));
    });

    it("should cast ResponseActions", () => {
      expect(hasPayload(action0)).toEqual(false);
      expect(hasPayload(action1)).toEqual(true);
      expect(hasPayload(action2)).toEqual(true);
    });

    it("should cast SuccessActions", () => {
      expect(hasPayload(action0)).toEqual(false);
      expect(hasSuccessPayload(action1)).toEqual(true);
      expect(hasSuccessPayload(action2)).toEqual(false);
    });

    it("should cast FailureActions", () => {
      expect(hasPayload(action0)).toEqual(false);
      expect(hasErrorPayload(action1)).toEqual(false);
      expect(hasErrorPayload(action2)).toEqual(true);
    });
  });

  describe("creator", () => {
    it("should handle normal payload", () => {
      const result = actionType.createResponse(payload);
      expect(
        result,
      ).not.toBeUndefined();
    });

    describe("SuccessAction", () => {

      it("should set payload", () => {
        const result = actionType.createResponse(payload);
        expect(
          result.payload,
        ).toBe(payload);
      });

      it("should be error false", () => {
        const result = actionType.createResponse(payload);
        expect(
          result.error,
        ).toBe(false);
      });
    });

    describe("FailureAction", () => {
      const error = new Error("test");

      it("should set payload", () => {
        const result = actionType.createResponse(error);
        expect(
          result.payload,
        ).toBe(error);
      });

      it("should be error true", () => {
        const result = actionType.createResponse(error);
        expect(
          result.error,
        ).toBe(true);
      });

      it("should handle extensions of error", () => {
        class TestError extends Error {
          public isTest: boolean;
          constructor() {
            super();
            this.isTest = true;
          }
        }
        const result = actionType.createResponse(new TestError());
        expect(
          result.error,
        ).toBe(true);
      });
    });
  });

  describe("createReducer", () => {
    interface State { hello: string; }
    const state = { hello: "" };
    const noPayload = "noPayload";
    const success = "success";
    const failure = new Error("falure");
    describe("success", () => {
      test("should return state if nothing passed in for suc", () => {
        const reducer = actionType.createReducer<State>();
        expect(
          reducer(state, actionType.createResponse(success)),
        ).toBe(state);
      });
      test("should run reducer", () => {
        const reducer = actionType.createReducer<State>(
          (s, hello) => ({ hello }),
        );
        expect(
          reducer(state, actionType.createResponse(success)),
        ).toEqual({ hello: success});
      });
    });
    describe("failure", () => {
      test("should return state if nothing passed in for suc", () => {
        const reducer = actionType.createReducer<State>();
        expect(
          reducer(state, actionType.createResponse(failure)),
        ).toBe(state);
      });
      test("should run reducer", () => {
        const reducer = actionType.createReducer<State>(
          undefined,
          (s, error) => ({ hello: error.message }),
        );
        expect(
          reducer(state, actionType.createResponse(failure)),
        ).toEqual({ hello: failure.message});
      });
    });
    describe("noPayload", () => {
      test("should return state if nothing passed in for suc", () => {
        const reducer = actionType.createReducer<State>();
        expect(
          reducer(state, actionType.create()),
        ).toBe(state);
      });
      test("should run reducer", () => {
        const reducer = actionType.createReducer<State>(
          undefined,
          undefined,
          (s) => ({ hello: noPayload }),
        );
        expect(
          reducer(state, actionType.create()),
        ).toEqual({ hello: noPayload});
      });
    });
  });
});
