import { DOMSource } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const inputAction$ = domSource
    .select('.search-input')
    .events('input')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'input',
    }));

  const exitAction$ = domSource
    .select('.search-input')
    .events('keyup')
    .filter((ev: KeyboardEvent) => {
      return ev.which === 27;
    })
    .mapTo({ type: 'exitInput' });

  const focusAction$ = domSource
    .select('.search-input')
    .events('focus')
    .mapTo({ type: 'focusInput' });

  const blurAction$ = domSource
    .select('.search-input')
    .events('blur')
    .mapTo({ type: 'blurInput' });

  return xs.merge(focusAction$, blurAction$, inputAction$, exitAction$);
}
