import isolate from '@cycle/isolate';
import { ICheckboxListState, ISinks, ISources } from './interfaces';
import List from './List';

export { ICheckboxListState };

export function CheckboxList<T>(sources: ISources<T>): ISinks<T> {
  const identityLens = {
    get: (state) => state,
    set: (_, childState) => childState,
  };

  const listSinks = isolate(List, { onion: identityLens })(sources);

  return {
    DOM: listSinks.DOM,
    onion: listSinks.onion,
  };
}
