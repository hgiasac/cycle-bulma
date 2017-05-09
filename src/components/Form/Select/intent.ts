import { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const selectAction$ = domSource.select('select')
    .events('input')
    .map(ev => ({
      type: 'select',
      payload: (ev.target as HTMLSelectElement).value
    }));

  return selectAction$;
}
