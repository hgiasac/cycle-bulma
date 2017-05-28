import { DOMSource } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const passwordBlurAction$ = domSource.select('.password')
    .events('blur')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blurPassword',
    }));

  const repeatPasswordBlurAction$ = domSource.select('.repeat-password')
    .events('blur')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blurRepeatPassword',
    }));

  return xs.merge(passwordBlurAction$, repeatPasswordBlurAction$);
}
