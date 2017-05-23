import { DOMSource } from '@cycle/dom';
import { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const submitAction$ = domSource.select('.submit')
    .events('click')
    .mapTo({ type: 'submit' });

  return submitAction$;
}
