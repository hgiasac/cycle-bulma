import intent from './intent';
import { ISinks, ISources, IUSPhoneInputState } from './interfaces';
import model, { USPhoneInputState } from './model';
import view from './view';

export {
  USPhoneInputState,
  IUSPhoneInputState,
};

export function USPhoneInput(sources: ISources): ISinks {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
