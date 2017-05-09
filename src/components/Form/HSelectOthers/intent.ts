import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const clickAction$ = domSource.select('.item')
    .events('click')
    .map((ev) => {
      return {
        type: 'select',
        payload: (ev.currentTarget as HTMLLIElement).getAttribute('value'),
      };
    });

  const inputAction$ = domSource.select('.others')
    .events('input')
    .map(ev => ({
      type: 'otherInput',
      payload: (ev.target as HTMLInputElement).value,
    }))

  return xs.merge(clickAction$, inputAction$);
}
