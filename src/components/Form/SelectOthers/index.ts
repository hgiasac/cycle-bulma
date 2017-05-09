import { ISelectOthersState, ISources, ISinks } from './interfaces';
import intent from './intent';
import model from './model';
import view from './view';


export default function SelectOthers<T>(sources: ISources<T>): ISinks<T> {

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
  ISelectOthersState,
}
