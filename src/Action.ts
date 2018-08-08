export interface BaseAction {
  type: string;
}

export interface SuccessAction<T> {
  type: string;
  error: false;
  payload: T;
}

export interface FailureAction {
  type: string;
  error: true;
  payload: Error;
}

export type ResponseAction<T> = SuccessAction<T> | FailureAction;

export type Action<T> = BaseAction | ResponseAction<T>;

export function hasPayload<T>(action: Action<T>): action is ResponseAction<T> {
  return (action as ResponseAction<T>).error !== undefined;
}

export function hasSuccessPayload<T>(action: Action<T>): action is SuccessAction<T> {
  return (action as ResponseAction<T>).error === false;
}

export function hasErrorPayload<T>(action: Action<T>): action is FailureAction {
  return (action as ResponseAction<T>).error === true;
}

export type ResponseActionCreator<T> = (payload?: T | Error) => ResponseAction<T>;
export type BaseActionCreator = () => BaseAction;
export type BaseActionReducer<S> = (state: S, action: BaseAction) => S;
export type SuccessReducer<T, S> = (state: S, payload: T) => S;
export type FailureReducer<S> = (state: S, payload: Error) => S;

export class ActionType<T> {
  constructor(public type: string) {}

  public create(): BaseAction {
    return {
      type: this.type,
    };
  }

  public createResponse(payload: T | Error): ResponseAction<T> {
    if (payload instanceof Error) {
      return {
        type: this.type,
        payload,
        error: true,
      };
    }
    return {
      type: this.type,
      payload,
      error: false,
    };
  }

  public createReducer<S>(
    onSuccess: SuccessReducer<T, S> = (s, a) => s,
    onFailure: FailureReducer<S> = (s, a) => s,
    onNoPayload: BaseActionReducer<S> = (s, a) => s,
  ) {
    return (state: S, action: Action<T>) => {
      if (hasPayload(action)) {
        if (hasErrorPayload(action)) {
          return onFailure(state, action.payload);
        }
        return onSuccess(state, action.payload);
      }
      return onNoPayload(state, action);
    };
  }
}
