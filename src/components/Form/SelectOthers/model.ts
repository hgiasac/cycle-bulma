import xs, { Stream } from 'xstream';
import { IAction, ISelectOthersState, Reducer } from './interfaces';

import { defaultFilter, defaultArrayFilter } from '../Select';
import { validate } from '../../../validator';

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of(function(prev: ISelectOthersState<T>): ISelectOthersState<T> {

    const state: ISelectOthersState<T> = {
      attributeName: '',
      payload: '',
      selected: null,
      options: [],
      filterFn: defaultArrayFilter,
      isOthers: false,
      otherValue: 'others'
    };

    if (!prev) {
      return state;
    }

    if (typeof prev !== 'object') {
      state.payload = prev;
    } else {
      Object.assign(state, prev);
      if (state.validators && state.validators.length > 0) {
        state.validators = state.validators.map(v => ({
          ...v,
          attributeName: state.attributeName
        }));
      }
    }

    if (state.payload && state.validators && state.validators.length) {
      const validationResult = validate(state.validators, state.payload);
      return {
        ...state,
        ...validationResult,
      }
    }
    return Object.assign(state, prev);
  });

  const selectReducer$ = action$
    .filter(ev => ev.type === 'select')
    .map(ev => function(prev: ISelectOthersState<T>): ISelectOthersState<T> {

      let isValid = true;
      let errorMessage = null;
      let payload = ev.payload;
      const selected = defaultFilter(ev.payload, prev);

      const isOthers = ev.payload === prev.otherValue;

      if (isOthers) {
        isValid = false;
        payload = '';
      } else {
        const validationResult = validate(prev.validators, ev.payload);
        return {
          ...prev,
          isOthers: isOthers,
          selected: selected,
          payload: ev.payload,
          ...validationResult,
        }
      }


      return {
        ...prev,
        isOthers: isOthers,
        payload: payload,
        selected: selected,
        isValid: isValid,
        errorMessage: errorMessage,
      }
    });

  const otherInputReducer$ = action$
    .filter(ev => ev.type === 'otherInput')
    .map(ev => function(prev: ISelectOthersState<T>): ISelectOthersState<T> {

      const validationResult = validate(prev.validators, ev.payload);

      return {
        ...prev,
        payload: ev.payload,
        ...validationResult,
      }
    });

  return xs.merge(defaultReducer$, selectReducer$, otherInputReducer$);
}
