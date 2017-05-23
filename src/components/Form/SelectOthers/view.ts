import { div, input, label, p, VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { getValidClass, select } from '../../../dom';
import { ISelectOthersState } from './interfaces';

export default function view<T>(state$: Stream<ISelectOthersState<T>>): Stream<VNode> {

  return state$.map((state) => {
    const sLabel = state.label || null;
    const validClass = getValidClass(state.isValid);

    if (state.isOthers) {
      return div(state.containerClass || '', [
        sLabel ? label('.label', sLabel) : null,
        div('.columns', [
          select('', {
            ...state,
            containerClass: '.column',
            label: null,
          }) as VNode,
          div('.field.column', [
            p('.control', [
              input('.input.others' + validClass, {
                attrs: { value: state.payload },
              }),
            ]),
          ]),
        ]),
      ]);
    }

    return select('', {
      ...state,
      containerClass: state.containerClass || '',
      label: sLabel,
    }) as VNode;
  });
}
