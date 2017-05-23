import { VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { select } from '../../../dom';
import { ISelectState } from './interfaces';

export default function view<T>(state$: Stream<ISelectState<T>>): Stream<VNode> {

  return state$.map((state) => {
    return select('', state) as VNode;
  });
}
