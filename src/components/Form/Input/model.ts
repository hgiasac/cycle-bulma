import xs, { Stream } from 'xstream';
import { IAction, IState, Reducer } from './interfaces';
import { validate } from '../../../validator';

export default function model(action$: Stream<IAction>): Stream<Reducer> {

  const defaultReducer$ = xs.of(function (prev: IState): IState {

    const state: IState = {
      attributeName: '',
      payload: '',
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
    return Object.assign(state, prev);
  });

  const blurReducer$ = action$
    .filter(ev => ev.type === 'blur')
    .map(ev => function (prev: IState): IState {
      const validationResult = validate(prev.validators, ev.payload);

      return {
        ...prev,
        payload: ev.payload,
        ...validationResult
      }
    });

  return xs.merge(defaultReducer$, blurReducer$);

}
