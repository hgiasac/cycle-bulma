import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const selectAction$ = domSource.select('select')
    .events('input')
    .map(ev => ({
      type: 'select',
      payload: (ev.target as HTMLSelectElement).value
    }));

  const inputAction$ = domSource.select('.others')
    .events('blur')
    .map(ev => ({
      type: 'otherInput',
      payload: (ev.target as HTMLInputElement).value,
    }));

  return xs.merge(selectAction$, inputAction$);
}
