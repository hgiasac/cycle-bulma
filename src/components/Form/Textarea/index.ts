import intent from './intent';
import { ISinks, ISources } from './interfaces';
import model from './model';
import view from './view';

export function Textarea(sources: ISources): ISinks {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
