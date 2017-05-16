import { DOMSource } from '@cycle/dom';
import { Stream } from 'xstream';
import { IAction } from '../Select/interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const clickAction$ = domSource.select('.radio-item')
    .events('click')
    .map((ev) => ({
      type: 'select',
      payload: (ev.currentTarget as HTMLLIElement).getAttribute('value')
    }));

  return clickAction$;
}
