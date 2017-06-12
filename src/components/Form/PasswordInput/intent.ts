import { DOMSource } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import debounce from 'xstream/extra/debounce';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const passwordBlurAction$ = domSource.select('.password')
    .events('input')
    .compose(debounce(500))
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blurPassword',
    }));

  const repeatPasswordBlurAction$ = domSource.select('.repeat-password')
    .events('input')
    .compose(debounce(500))
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'blurRepeatPassword',
    }));

  return xs.merge(passwordBlurAction$, repeatPasswordBlurAction$);
}
