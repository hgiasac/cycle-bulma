import xs, { Stream } from 'xstream';
import { div, button, VNode } from '@cycle/dom';
import { Layout, IButtonProperties } from './interfaces';

export function renderButtons(properties: IButtonProperties): VNode {
  let buttons = [
    button('.button.is-primary.submit' + (properties.submitClass || ''), {
      props: {
        disabled: properties.isValid !== true
      }
    }, properties.submitText || 'Submit'),
  ];

  if (properties.canCancel) {
    const cancelDom = button('.button.cancel' + (properties.cancelClass || ''), [
      properties.cancelText || 'Cancel'
    ]);

    if (properties.cancelFirst) {
      buttons.unshift(cancelDom);
    } else {
      buttons.push(cancelDom);
    }
  }

  return div('.field' + (properties.canCancel ? '.is-group' : ''), buttons)
}

export default function view<T>(state$: Stream<T>, controlDOM$: Stream<VNode>[],
  layoutView?: Layout<T>): Stream<VNode> {

  return xs.combine(state$, ...controlDOM$)
    .map((items) => {
      const state = items[0];
      const doms = items.slice(1);

      if (layoutView) {
        return layoutView(state, doms);
      }
      return div('.form' + (state.className || ''), [
        ...doms,
        renderButtons(state),
      ]);
    });
}
