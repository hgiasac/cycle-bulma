import { div, i, input, label, p, VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction, ICheckboxState, ISinks, ISources, Reducer } from './interfaces';

export {
  ICheckboxState,
};

function intent<T>(sources: ISources<T>): Stream<IAction> {

  const onClick$ = sources.DOM.select('input')
    .events('click')
    .compose(sources.Time.delay(200))
    .map((ev) => {
      return {
        payload: (ev.target as HTMLInputElement).checked,
        type: 'CLICK',
      };
    });

  return onClick$;
}

function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of((prev?: ICheckboxState<T>): ICheckboxState<T> => {

    if (prev) {
      return prev;
    }
    return {
      isChecked: false,
      isDisabled: false,
      label: '',
      value: null,
    };
  });

  const clickReducer$ = action$.filter((ev) => ev.type === 'CLICK')
    .map((ev) => (prev: ICheckboxState<T>): ICheckboxState<T> => {
      return {
        ...prev,
        isChecked: ev.payload,
      };
    });

  return xs.merge(defaultReducer$, clickReducer$);
}

function view<T>(state$: Stream<ICheckboxState<T>>): Stream<VNode> {

  return state$.map((state) => {
    const titleDOM = typeof state.label === 'function' ? state.label() : state.label;

    return div('.field', [
      p('.checkbox-control', [
        label('.checkbox' + (state.className || ''), [
          input('', {
            attrs: {
              checked: state.isChecked,
              disabled: state.isDisabled,
              type: 'checkbox',
            },
          }, []),
          i('.helper'),
          titleDOM,
        ]),
      ]),
    ]);
  });
}

export function Checkbox<T>(sources: ISources<T>): ISinks<T> {
  const state$ = sources.onion.state$;
  const action$ = intent<T>(sources);
  const reducer$ = model<T>(action$);
  const vdom$ = view<T>(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
