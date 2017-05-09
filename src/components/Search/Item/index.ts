import { Stream } from 'xstream';
import { IState, ISources, ISinks } from './interfaces';

import intent from './intent';
import model from './model';
import view from './view';

export default function Option<T>(sources: ISources<T>): ISinks<T> {

  const state$ = sources.onion.state$ as any as Stream<IState<T>>;
  const intent$ = intent(sources.DOM);
  const reducer$ = model<T>(intent$);

  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  }
}

export {
  IState as IItemState
}
