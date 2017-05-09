import { Stream } from 'xstream';
import { span, a, VNode } from '@cycle/dom';
import { IState } from './interfaces';

export default function view<T>(state$: Stream<IState<T>>): Stream<VNode> {

  const vdom$ = state$.map(state => {
    return a('.result', [
      span('.result-content', [
        span('.caption', state.optionContent)
      ])
    ]);
  });

  return vdom$;
}
