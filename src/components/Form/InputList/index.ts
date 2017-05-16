import xs, { Stream } from 'xstream';
import {
  a, div, i, input,
  span, DOMSource, VNode
} from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import { IAction, ISources, ISinks, IInputListState, Reducer } from './interfaces';
import { newInputState } from '../Input';

import List from './List';

export {
  IInputListState,
  List,
}

function intent(domSource: DOMSource): Stream<IAction> {

  const inputAction$ = domSource.select('.input')
    .events('input')
    .map(ev => ({
      type: 'input',
      payload: (ev.target as HTMLInputElement).value
    }));

  const addAction$ = domSource.select('.add')
    .events('click')
    .mapTo({ type: 'add' });

  return xs.merge(inputAction$, addAction$);
}


function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of(function(prev?: IInputListState<T>): IInputListState<T> {
    if (prev) {
      return prev;
    }

    return {
      textInput: newInputState(),
      items: []
    }
  });

  const inputReducer$ = action$
    .filter(ev => ev.type === 'input')
    .map(ev => function(prev: IInputListState<T>): IInputListState<T> {
      return {
        ...prev,
        textInput: {
          ...prev.textInput,
          payload: ev.payload,
        }
      }
    });

  const addReducer$ = action$
    .filter(ev => ev.type === 'add')
    .mapTo(function(prev: IInputListState<T>): IInputListState<T> {
      if (prev.textInput.payload) {
        const item = {
          payload: prev.textInput.payload,
          content: prev.textInput.payload,
        };

        return {
          ...prev,
          textInput: {
            ...prev.textInput,
            payload: '',
          },
          items: prev.items.concat([item]),
        };
      }

      return prev;
    });

  return xs.merge(defaultReducer$, inputReducer$, addReducer$);
}

function view<T>(state$: Stream<IInputListState<T>>, listDOM$: Stream<VNode>): Stream<VNode> {

  return xs.combine(state$, listDOM$)
    .map(([state, listDOM]) => {
      return div('', [
        div('.field.is-grouped', [
          input('.input', {
            props: {
              value: state.textInput.payload,
            }
          }),
          a('.button-icon.add', [
            span('.icon', [
              i('.fa.fa-plus')
            ])
          ]),
        ]),
        listDOM
      ]);
    });
}


export default function InputList<T>(sources: ISources<T>): ISinks<T> {

  const identityLens: Lens<IInputListState<T>, IInputListState<T>> = {
    get: state => state,
    set: (_, childState) => childState
  };

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const parentReducer$ = model(action$);
  const childrenSinks = isolate(List, { onion: identityLens })(sources);

  const vdom$ = view(state$, childrenSinks.DOM);

  const reducer$ = xs.merge(parentReducer$, childrenSinks.onion);
  return {
    DOM: vdom$,
    onion: reducer$ as any as Stream<Reducer<T>>,
  };
}
