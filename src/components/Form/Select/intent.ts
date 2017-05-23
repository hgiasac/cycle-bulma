import { DOMSource } from '@cycle/dom';
import { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const selectAction$ = domSource.select('select')
    .events('input')
    .map((ev) => ({
      payload: (ev.target as HTMLSelectElement).value,
      type: 'select',
    }));

  return selectAction$;
}
