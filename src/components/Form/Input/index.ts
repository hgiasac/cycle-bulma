import intent from './intent';
import { ISinks, ISources, IState } from './interfaces';
import model, { InputState } from './model';
import view from './view';

export {
  InputState,
  IState as IInputState,
};

export function Input(sources: ISources): ISinks {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
