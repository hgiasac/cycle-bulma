import { VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { activeInput } from '../../../dom';
import { IState } from './interfaces';

export default function view(state$: Stream<IState>): Stream<VNode> {

  return state$.map((state) => {
    if (!state) {
      return null;
    }

    return activeInput(state.className || '', {
      attrs: {
        disabled: state.isDisabled,
        placeholder: state.placeholder,
        type: state.type,
        value: state.payload,
      },
    }, {
      ...state,
     })  as VNode;
  });

}
