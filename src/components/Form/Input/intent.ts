import { DOMSource } from '@cycle/dom';
import { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const blurAction$ = domSource.select('.input')
    .events('blur')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blur',
    }));

  return blurAction$;
}
