import { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import { IState } from './interfaces';
import { textarea } from '../../../dom';

export default function view(state$: Stream<IState>): Stream<VNode> {

  return state$.map(state => {
    if (!state) {
      return null;
    }
    return textarea('', {
      props: {
        value: state.payload,
        disabled: state.isDisabled,
      }
    }, {
      ...state
      }) as VNode;
  });

}
