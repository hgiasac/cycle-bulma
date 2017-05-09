import { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const blurAction$ = domSource.select('.input')
    .events('blur')
    .map(ev => ({
      type: 'blur',
      payload: (ev.target as HTMLInputElement).value
    }));

  return blurAction$;
}
