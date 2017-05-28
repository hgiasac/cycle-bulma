import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { IAutocompleteState, ISinks, ISources, Reducer } from './interfaces';

import intent from '../../Search/intent';
import List from './List';
import model, { AutocompleteState } from './model';
import view from './view';

export function Autocomplete<T>(sources: ISources<T>): ISinks<T> {

  const identityLens: Lens<IAutocompleteState<T>, IAutocompleteState<T>> = {
    get: (state) => state,
    set: (_, childState) => {
      if (childState.isValid) {
        return { ...childState };
      }
      return childState;
    },
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
  IAutocompleteState,
  AutocompleteState,
};
