import { ISinks, ISources } from '../Select/interfaces';
import model from '../Select/model';
import intent from './intent';
import view from './view';

export function RadioList<T>(sources: ISources<T>): ISinks<T> {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  const sinks = {
    DOM: vdom$,
    onion: reducer$,
  };

  return sinks;
}
