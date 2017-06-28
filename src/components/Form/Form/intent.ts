import { Stream } from 'xstream';
import { IAction, IFormState, ISources } from './interfaces';
import { validateForm } from './model';

export default function intent<T extends IFormState>(sources: ISources<T>): Stream<IAction> {
  const state$ = sources.onion.state$;

  const submitAction$ = sources.DOM.select('.submit')
    .events('click')
    .mapTo(state$.map((state) => {
        validateForm(state);
        return {
          payload: state.isValid,
          type: 'onValidated',
        };
      }).take(1),
    ).flatten();

  return submitAction$;
}
