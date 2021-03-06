import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { ISearchState, ISinks, ISources, Reducer } from './interfaces';

import intent from './intent';
import List from './List';
import model, { SearchState } from './model';
import view from './view';

export function Search<T>(sources: ISources<T>): ISinks<T> {

  const identityLens: Lens<ISearchState<T>, ISearchState<T>> = {
    get: (state) => state,
    set: (_, childState) => childState,
  };

  const state$ = sources.onion.state$;
  const intent$ = intent(sources.DOM);
  const parentReducer$ = model(intent$);
  const listSinks = isolate(List, { onion: identityLens })(sources);

  const reducer$ = xs.merge(parentReducer$, listSinks.onion);

  const vdom$ = view(state$, listSinks.DOM);

  return {
    DOM: vdom$,
    onion: reducer$ as any as Stream<Reducer<T>>,
  };

}

export {
  ISearchState,
  SearchState,
};
