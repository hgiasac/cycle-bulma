import { ISinks, ISources } from '../SelectOthers/interfaces';
import model from '../SelectOthers/model';
import intent from './intent';
import view from './view';

export function HSelectOthers<T>(sources: ISources<T>): ISinks<T> {

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
