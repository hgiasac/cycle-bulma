import { Stream } from 'xstream';
import { div, label, input, p, VNode } from '@cycle/dom';
import { ISelectOthersState } from './interfaces';
import { getValidClass, select } from '../../../dom';

export default function view<T>(state$: Stream<ISelectOthersState<T>>): Stream<VNode> {

  return state$.map(state => {
    const sLabel = state.label || null;
    const validClass = getValidClass(state.isValid);

    if (state.isOthers) {
      return div(state.containerClass || '', [
        sLabel ? label('.label', sLabel) : null,
        div('.columns', [
          select('', {
            ...state,
            label: null,
            containerClass: '.column'
          }) as VNode,
          div('.field.column', [
            p('.control', [
              input('.input.others' + validClass, {
                attrs: { value: state.payload }
              }),
            ]),
          ])
        ])
      ]);
    }

    return select('', {
      ...state,
      label: sLabel,
      containerClass: state.containerClass || ''
    }) as VNode;
  });
}
