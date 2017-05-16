import { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import { IState } from './interfaces';
import { input } from '../../../dom';

export default function view(state$: Stream<IState>): Stream<VNode> {

  return state$.map(state => {
    if (!state) {
      return null;
    }

    return input('', {
      attrs: {
        value: state.payload,
        disabled: state.isDisabled,
        placeholder: state.placeholder,
      }
    }, {
      ...state
     })  as VNode;
  });

}
