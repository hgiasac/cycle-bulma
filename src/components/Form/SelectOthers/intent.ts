import { DOMSource } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const selectAction$ = domSource.select('select')
    .events('input')
    .map((ev) => ({
      payload: (ev.target as HTMLSelectElement).value,
      type: 'select',
    }));

  const inputAction$ = domSource.select('.others')
    .events('blur')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'otherInput',
    }));

  return xs.merge(selectAction$, inputAction$);
}
