
import { DOMSource } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const clickAction$ = domSource.select('.item')
    .events('click')
    .map((ev) => {
      return {
        payload: (ev.currentTarget as HTMLLIElement).getAttribute('value'),
        type: 'select',
      };
    });

  const inputAction$ = domSource.select('.others')
    .events('input')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'otherInput',
    }));

  return xs.merge(clickAction$, inputAction$);
}
