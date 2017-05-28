import { DOMSource } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const inputAction$ = domSource.select('.input')
    .events('input')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'input',
    }));

  const blurAction$ = domSource.select('.input')
    .events('blur')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blur',
    }));

  return xs.merge(inputAction$, blurAction$);
}
