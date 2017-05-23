import { VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { textarea } from '../../../dom';
import { IState } from './interfaces';

export default function view(state$: Stream<IState>): Stream<VNode> {

  return state$.map((state) => {
    if (!state) {
      return null;
    }
    return textarea('', {
      props: {
        disabled: state.isDisabled,
        value: state.payload,
      },
    }, {
      ...state,
      }) as VNode;
  });

}
