import { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const blurAction$ = domSource.select('.textarea')
    .events('blur')
    .map(ev => ({
      type: 'blur',
      payload: (ev.target as HTMLTextAreaElement).value
    }));

  return blurAction$;
}
