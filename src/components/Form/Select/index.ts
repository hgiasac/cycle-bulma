import intent from './intent';
import { ISelectState, ISinks, ISources } from './interfaces';
import model, { defaultArrayFilter, defaultFilter, SelectState } from './model';
import view from './view';

export function Select<T>(sources: ISources<T>): ISinks<T> {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}

export {
  model,
  defaultFilter,
  defaultArrayFilter,
  ISelectState,
  SelectState,
};
