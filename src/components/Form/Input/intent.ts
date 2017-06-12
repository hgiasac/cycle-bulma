import { DOMSource } from '@cycle/dom';
import { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const blurAction$ = domSource.select('.input')
    .events('input')
    .compose(debounce(500))
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blur',
    }));

  return blurAction$;
}
