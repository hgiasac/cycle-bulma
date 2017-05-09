import { div, label, p, VNode } from '@cycle/dom';
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
      return div('.item' + (opt === state.selected ? '.is-active' : ''), {
        attrs: { value: value },
      }, content);
    });
  } else if (typeof state.options === 'object') {
    for (let k in state.options) {
      const option = state.options[k];

      options.push(
        div('.item' + (option === state.selected ? '.is-active' : ''), {
          attrs: { value: k },
        }, [state.options[k]]
        )
      );
    }
  }

  return options;
}

// tslint:disable triple-equals
export default function view<T>(state$: Stream<ISelectState<T>>): Stream<VNode> {
  return state$.map((state) => {

    const options = renderOptions(state);
    const validClass = '.hselect' + (state.isValid === true ? '.is-success' : (state.isValid === false ? '.is-danger' : ''));

    return div('.field', [
      state.label ? label('.label', state.label) : null,
      p('.control', [
        div(validClass, [
          div('.list', options),
        ])
      ])
    ]);
  });
}
