import { VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { input } from '../../../dom';
import { IUSPhoneInputState } from './interfaces';

export default function view(state$: Stream<IUSPhoneInputState>): Stream<VNode> {

  return state$.map((state) => {
    if (!state) {
      return null;
    }

    return input('', {
      props: {
        disabled: state.isDisabled,
        placeholder: state.placeholder,
        value: state.payload,
      },
    }, {
      ...state,
     })  as VNode;
  });

}
