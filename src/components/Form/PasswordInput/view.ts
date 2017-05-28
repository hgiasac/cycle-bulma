import { div, label, VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { input } from '../../../dom';
import { IPasswordInputState } from './interfaces';

export default function view(state$: Stream<IPasswordInputState>): Stream<VNode> {

  return state$.map((state) => {
    if (!state) {
      return null;
    }

    return div('.columns', [
      div('.field.column', [
        label('.label', 'Password'),
        input('.password', {
          attrs: {
            disabled: state.password.isDisabled,
            placeholder: state.password.placeholder,
            type: 'password',
            value: state.password.payload,
          },
        }, { ...state.password }),
      ]),
      div('.field.column', [
        label('.label', 'Repeat Password'),
        input('.repeat-password', {
          attrs: {
            disabled: state.repeatPassword.isDisabled,
            placeholder: state.repeatPassword.placeholder,
            type: 'password',
            value: state.repeatPassword.payload,
          },
        }, { ...state.repeatPassword }),
      ]),
    ]);
  });

}
