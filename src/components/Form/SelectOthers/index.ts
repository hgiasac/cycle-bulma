import intent from './intent';
import { ISelectOthersState, ISinks, ISources } from './interfaces';
import model from './model';
import view from './view';

export function SelectOthers<T>(sources: ISources<T>): ISinks<T> {

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
  ISelectOthersState,
};
