import { VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { input } from '../../../dom';
import { IState } from './interfaces';

export default function view(state$: Stream<IState>): Stream<VNode> {

  return state$.map((state) => {
    if (!state) {
      return null;
    }

    return input('', {
      attrs: {
        disabled: state.isDisabled,
        placeholder: state.placeholder,
        value: state.payload,
      },
    }, {
      ...state,
     })  as VNode;
  });

}
