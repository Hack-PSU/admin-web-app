import { GetState, SetState } from "zustand";
import { EventStore } from "common/store/slices";

export type State = EventStore;

export type ModelSlice<TSlice extends object> = TSlice;

export type StoreSlice<
  TSlice extends object,
  TOptionalSlice extends object = TSlice
> = (
  set: SetState<
    TOptionalSlice extends TSlice ? TOptionalSlice : TOptionalSlice & TSlice
  >,
  get: GetState<
    TOptionalSlice extends TSlice ? TOptionalSlice : TOptionalSlice & TSlice
  >
) => TSlice;

export type StoreDispatch<TActions> = (action: TActions, payload?: any) => void;

export type StoreAction<TActions> = (
  set: SetState<State>
) => StoreDispatch<TActions>;

export type Store<TModel extends object, TActions> = {
  store: TModel;
  dispatch: StoreAction<TActions>;
};
