import { ISelectState, ISources, ISinks } from './interfaces';
import intent from './intent';
import model, { defaultFilter, defaultArrayFilter, newSelectState } from './model';
import view from './view';


export default function Select<T>(sources: ISources<T>): ISinks<T> {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

export {
  model,
  defaultFilter,
  defaultArrayFilter,
  ISelectState,
  newSelectState,
}
