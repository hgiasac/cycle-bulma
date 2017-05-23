import { DOMSource } from '@cycle/dom';
import { Stream } from 'xstream';
import { IAction } from '../interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const outFocusAction$ = domSource
    .select('.results')
    .events('blur')
    .mapTo({ type: 'outfocusList' });

  return outFocusAction$;
}
