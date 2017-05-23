import { div, ul, VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { input } from '../../../dom';
import { renderOptions } from '../HSelect/view';
import { ISelectOthersState } from '../SelectOthers';

export default function view<T>(state$: Stream<ISelectOthersState<T>>): Stream<VNode> {
  return state$.map((state) => {

    const options = renderOptions(state);
    const validClass = '.hselect' + (state.isValid === true ? '.is-success' : (state.isValid === false ? '.is-danger' : ''));

    return div('', [
      div('.tabs.is-toggle', [
        ul(validClass, options),
      ]),
      state.isOthers ? input('', {
        attrs: { value: state.payload },
      }, {
        isValid: state.isValid,
      }) : null,
    ]);
  });
}
