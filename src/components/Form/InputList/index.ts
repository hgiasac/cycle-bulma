import {
  a, div, DOMSource, i,
  input, span, VNode,
} from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { getValidClass } from '../../../dom';
import { InputState } from '../Input';
import { IAction, IInputListProperties, IInputListState, ISinks, ISources, Reducer } from './interfaces';
import List from './List';

export {
  IInputListState,
  List,
};

function intent(domSource: DOMSource): Stream<IAction> {

  const inputAction$ = domSource.select('.input')
    .events('input')
    .map((ev) => ({
      payload: (ev.target as HTMLInputElement).value,
      type: 'input',
    }));

  const addAction$ = domSource.select('.add')
    .events('click')
    .mapTo({ type: 'add' });

  return xs.merge(inputAction$, addAction$);
}

function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of((prev?: IInputListState<T>): IInputListState<T> => {
    if (prev) {
      return prev;
    }

    return {
      items: [],
      textInput: InputState(),
    };
  });

  const inputReducer$ = action$
    .filter((ev) => ev.type === 'input')
    .map((ev) => (prev: IInputListState<T>): IInputListState<T> => {
      return {
        ...prev,
        textInput: {
          ...prev.textInput,
          payload: ev.payload,
        },
      };
    });

  const addReducer$ = action$
    .filter((ev) => ev.type === 'add')
    .mapTo((prev: IInputListState<T>): IInputListState<T> => {
      if (prev.textInput.payload) {
        const item = {
          content: prev.textInput.payload,
          payload: prev.textInput.payload,
        };

        return {
          ...prev,
          items: prev.items.concat([item]),
          textInput: {
            ...prev.textInput,
            payload: '',
          },
        };
      }

      return {
        ...prev,
        textInput: {
          ...prev.textInput,
          isValid: false,
        },
      };
    });

  return xs.merge(defaultReducer$, inputReducer$, addReducer$);
}

function view<T>(state$: Stream<IInputListState<T>>, listDOM$: Stream<VNode>): Stream<VNode> {

  return xs.combine(state$, listDOM$)
    .map(([state, listDOM]) => {
      return div('', [
        div('.field.is-grouped', [
          input('.input' + getValidClass(state.textInput.isValid), {
            props: {
              value: state.textInput.payload,
            },
          }),
          a('.button-icon.add', [
            span('.icon', [
              i('.fa.fa-plus'),
            ]),
          ]),
        ]),
        listDOM,
      ]);
    });
}

export function InputList<T>(sources: ISources<T>, properties?: IInputListProperties<T>): ISinks<T> {

  const identityLens: Lens<IInputListState<T>, IInputListState<T>> = {
    get: (state) => state,
    set: (_, childState) => childState,
  };

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const parentReducer$ = model(action$);
  const childrenSinks = isolate(List, { onion: identityLens })(sources, properties);

  const vdom$ = view(state$, childrenSinks.DOM);

  const reducer$ = xs.merge(parentReducer$, childrenSinks.onion);
  return {
    DOM: vdom$,
    onion: reducer$ as any as Stream<Reducer<T>>,
  };
}
