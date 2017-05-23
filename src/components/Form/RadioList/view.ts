import { div, input, label, p, span, VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { ISelectState } from '../Select/interfaces';

export function renderOptions<T>(state: ISelectState<T>): VNode[] {
  let options: VNode[] = [];

  if (Array.isArray(state.options)) {
    options = state.options.map((opt) => {

      let value = state;
      let content = state;
      if (typeof opt === 'object') {
        value = opt[state.valueKey];
        content = typeof state.contentKey === 'function' ?
          state.contentKey(opt) : opt[state.contentKey];
      }
      return p('.control', [
        label('.radio', [
          input('.radio-item', {
            props: {
              checked: opt === state.selected,
              name: state.attributeName,
              type: 'radio',
              value,
            },
          }),
          span('.outer', [
            span('.inner'),
          ]),
          content,
        ]),
      ]);
    });
  } else if (typeof state.options === 'object') {
    Object.keys(state.options).forEach((k) => {
      options.push(
        p('.control', [
          label('.radio', [
            input('.radio-item', {
              props: {
                checked: k === state.selected,
                name: state.attributeName,
                type: 'radio',
                value: k,
              },
            }),
            span('', state.options[k]),
          ]),
        ]),

      );
    });
  }

  return options;
}

// tslint:disable triple-equals
export default function view<T>(state$: Stream<ISelectState<T>>): Stream<VNode> {
  return state$.map((state) => {

    const options = renderOptions(state);
    return div('.field', [
      state.label ? label('.label', state.label) : null,
      ...options,
    ]);
  });
}
