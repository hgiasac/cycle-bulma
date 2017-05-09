import xs, { Stream } from 'xstream';
import { div, button, VNode } from '@cycle/dom';
import { View, ControlView } from './interfaces';

function renderButtons(state) {
  let buttons = [
    button('.button.is-primary.submit' + (state.submitClass || ''), {
      props: {
        disabled: state.isValid !== true
      }
    }, state.submitText || 'Submit'),
  ];

  if (state.canCancel) {
    const cancelDom = button('.button.cancel' + (state.cancelClass || ''), [
        state.cancelText || 'Cancel'
    ]);

    if (state.cancelFirst) {
      buttons.unshift(cancelDom);
    } else {
      buttons.push(cancelDom);
    }
  }

  return div('.field' + (state.canCancel ? '.is-group' : ''), buttons)
}

export default function view<T>(state$: Stream<T>, controlDOM$: Stream<VNode>[],
  layoutView?: View<T>, controlView?: ControlView<T>): Stream<VNode> {

  return xs.combine(state$, ...controlDOM$)
    .map((items) => {
      const state = items[0];
      const doms = items.slice(1);
      const controlDom = controlView ? [controlView(state, doms)] : (doms);

      const formVDom = div('.form', [
        ...controlDom,
        renderButtons(state),
      ]);

      if (!layoutView) {
        return formVDom;
      }

      return layoutView(state, formVDom);
    });
}
