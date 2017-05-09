import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { IAction } from './interfaces';

export default function intent(domSource: DOMSource): Stream<IAction> {

  const selectAction$ = domSource
    .select('.result')
    .events('click')
    .mapTo({ type: 'select' });

  const hoverAction$ = domSource
    .select('.result')
    .events('mouseover')
    .mapTo({ type: 'hover' });

  const blurAction$ = domSource
    .select('.result')
    .events('mouseleave')
    .mapTo({ type: 'blur' });

  return xs.merge(selectAction$, hoverAction$, blurAction$);
}
