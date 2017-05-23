import { button, div, VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { ControlComponent, IButtonProperties, IDOMDictionary, IProperties, Layout } from './interfaces';

export function renderButtons(properties: IButtonProperties): VNode {
  const buttons = [
    button('.button.is-primary.submit' + (properties.submitClass || ''), {
      props: {
        disabled: properties.isValid !== true,
      },
    }, properties.submitText || 'Submit'),
  ];

  if (properties.canCancel) {
    const cancelDom = button('.button.cancel' + (properties.cancelClass || ''), [
      properties.cancelText || 'Cancel',
    ]);

    if (properties.cancelFirst) {
      buttons.unshift(cancelDom);
    } else {
      buttons.push(cancelDom);
    }
  }

  return div('.field' + (properties.canCancel ? '.is-group' : ''), buttons);
}

function viewDictionary(components: { [key: string]: ControlComponent<any> } , controlDOM: VNode[]): IDOMDictionary {
  return Object.keys(components).reduce((a, k, i) => {
    a[k] = controlDOM[i];
    return a;
  }, {});
}

export default function view<T>(state$: Stream<T>, controlDOM$: Array<Stream<VNode>>,
                                layoutView?: Layout<T>, properties?: IProperties<T>): Stream<VNode> {

  return xs.combine(state$, ...controlDOM$)
    .map((items) => {
      const state = items[0];
      const doms = items.slice(1);

      if (layoutView) {
        const vdomDict = viewDictionary(properties.components, doms);
        return layoutView(state, vdomDict);
      }
      return div('.form' + (state.className || ''), [
        ...doms,
        renderButtons(state),
      ]);
    });
}
