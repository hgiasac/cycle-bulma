import { div, input, VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { ISearchState } from './interfaces';

export default function view<T>(state$: Stream<ISearchState<T>>, listNode$: Stream<VNode>): Stream<VNode> {

  return xs.combine(state$, listNode$)
    .map(([state, listNode]) => {
      const results = state.isListVisible ? listNode : null;

      return div('.ui-search', [
        input('.search-input' + (state.inputClass || ''), {
          props: {
            autocomplete: 'off',
            placeholder: state.placeholder,
            value: state.payload,
          },
        }), results,
      ]);
    });
}
