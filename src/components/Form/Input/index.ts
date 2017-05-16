import { ISources, ISinks, IState } from './interfaces';
import intent from './intent';
import model, { newInputState } from './model';
import view from './view';

export {
  newInputState,
  IState as IInputState
};

export default function Input(sources: ISources): ISinks {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$
  }
}
