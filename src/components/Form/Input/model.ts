import xs, { Stream } from 'xstream';
import { validate } from '../../../validator';
import { IAction, IState, Reducer } from './interfaces';

export function InputState(options?: IState): IState {
  const state = {
    attributeName: '',
    payload: '',
  };

  if (options) {
    return {
      ...state,
      ...options,
    };
  }

  return state;
}
export default function model(action$: Stream<IAction>): Stream<Reducer> {

  const defaultReducer$ = xs.of((prev: IState): IState => {

    if (!prev) {
      return InputState();
    }

    if (typeof prev !== 'object') {
      return InputState({
        payload: prev,
      });
    }

    if (prev.validators && prev.validators.length > 0) {
      prev.validators = prev.validators.map((v) => ({
        ...v,
        attributeName: prev.attributeName,
      }));
    }

    return prev;
  });

  const blurReducer$ = action$
    .filter((ev) => ev.type === 'blur')
    .map((ev) => (prev: IState): IState => {
      const validationResult = validate(prev.validators, ev.payload);

      return {
        ...prev,
        payload: ev.payload,
        ...validationResult,
      };
    });

  return xs.merge(defaultReducer$, blurReducer$);

}
