import xs, { Stream } from 'xstream';
import { div, input, VNode } from '@cycle/dom';
import { ISearchState } from './interfaces';

export default function view<T>(state$: Stream<ISearchState<T>>, listNode$: Stream<VNode>): Stream<VNode> {

  return xs.combine(state$, listNode$)
    .map(([state, listNode]) => {
      const results = state.isListVisible ? listNode : null;

      return div('.ui-search', [
        input('.search-input', {
          props: {
            value: state.payload,
            placeholder: state.placeholder,
            autocomplete: 'off'
          }
        }), results
      ]);
    });
}
