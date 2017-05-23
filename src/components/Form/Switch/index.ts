import { div, DOMSource, input, label, span, VNode } from '@cycle/dom';
import xs, { Stream } from 'xstream';
import { IAction, ISinks, ISources, IState, Reducer } from './interfaces';

function intent(domSource: DOMSource): Stream<IAction> {

  const checkAction$ = domSource.select('.switcher')
    .events('click')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).checked,
      type: 'check',
    }));

  return checkAction$;
}

function model(action$: Stream<IAction>): Stream<Reducer> {

  const defaultReducer$ = xs.of((prev?: IState): IState => {
    if (prev) {
      return prev;
    }

    return {
      label: '',
      payload: false,
    };
  });

  const checkReducer$ = action$.filter((ev) => ev.type === 'check')
    .map((ev) => (prev: IState): IState => {
      return {
        ...prev,
        payload: ev.payload,
      };
    });

  return xs.merge(defaultReducer$, checkReducer$);
}

function view(state$: Stream<IState>): Stream<VNode> {

  return state$.map((state) => {
    return div('.switch', [
      label('', [
        input('.switcher', {
          attrs: { type: 'checkbox', checked: state.payload },
        }),
        span('.lever'),
        state.label,
      ]),
    ]);
  });
}

export function Switch(sources: ISources): ISinks {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}

export {
  IState as ISwitchState,
};
