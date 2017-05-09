import { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import { ISelectState } from './interfaces';
import { select } from '../../../dom';

export default function view<T>(state$: Stream<ISelectState<T>>): Stream<VNode> {

  return state$.map(state => {
    return select('', state) as VNode;
  });
}
