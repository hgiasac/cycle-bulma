import xs, { Stream } from 'xstream';
import { IAction, ISelectState, Reducer } from './interfaces';
import { validate } from '../../../validator';

export function defaultArrayFilter<T>(payload: string, item: T, state: ISelectState<T>): boolean {
  if (typeof item === 'object') {
    return payload === item[state.valueKey];
  }

  return payload === item;
}

export function defaultFilter<T>(payload: string, state: ISelectState<T>): T | string {
  if (Array.isArray(state.options)) {
    return state.options.filter((o: T) => state.filterFn(payload, o, state))[0];
  } else if (typeof state.options === 'object') {
    for (let key in state.options as any) {
      if (key === payload) {
        return key;
      }
    }
  }

  return null;
}

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of(function(prev: ISelectState<T>): ISelectState<T> {

    const state: ISelectState<T> = {
      attributeName: '',
      payload: '',
      selected: null,
      options: [],
      filterFn: defaultArrayFilter,
    };

    if (!prev) {
      return state;
    }

    if (typeof prev !== 'object') {
      state.payload = prev;
      return state;
    }

    if (!prev.filterFn) {
      prev.filterFn = defaultArrayFilter;
    }

    if (prev.validators && prev.validators.length > 0) {
      prev.validators = prev.validators.map(v => ({
        ...v,
        attributeName: prev.attributeName
      }));
    }

    if (prev.isValid === undefined && prev.payload && prev.validators && prev.validators.length > 0) {
      const validationResult = validate(prev.validators, prev.payload);
      return {
        ...prev,
        ...validationResult,
      }
    }

    return prev;
  });

  const selectReducer$ = action$
    .filter(ev => ev.type === 'select')
    .map(ev => function(prev: ISelectState<T>): ISelectState<T> {

      const selected = defaultFilter(ev.payload, prev);
      const validationResult = validate(prev.validators, ev.payload);


      return {
        ...prev,
        payload: ev.payload,
        selected: selected,
        ...validationResult,
      }
    });

  return xs.merge(defaultReducer$, selectReducer$);

}
