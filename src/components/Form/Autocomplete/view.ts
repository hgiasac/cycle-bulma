import { div, i, input, p, span, VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { getValidClass, getValidIcon, getValidMesseage } from '../../../dom';
import { IAutocompleteState } from './interfaces';

export default function view<T>(state$: Stream<IAutocompleteState<T>>, listNode$: Stream<VNode>): Stream<VNode> {

  return xs.combine(state$, listNode$)
    .map(([state, listNode]) => {
      const results = state.isListVisible ? listNode : null;

      return div('.ui-search', [
        p('.control.has-icons-right', [
          input('.search-input' + (state.inputClass || ''), {
            props: {
              autocomplete: 'off',
              disabled: state.isDisabled,
              placeholder: state.placeholder,
              value: state.payload,
            },
          }),
          span('.icon.is-right' + (state.size || ''), [
            i(getValidIcon(state)),
          ]),
        ]),
        p('.help' + getValidClass(state.isValid), getValidMesseage(state)),
        results,
      ]);
    });
}
