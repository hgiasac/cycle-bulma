import { div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Lens, mix, pick } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { IInputListState, IItemState, ISinks, ISources, Reducer } from './interfaces';
import Item from './Item';

const itemLens = <T>(index: number): Lens<IInputListState<T>, IItemState<T>> => {
  return {
    get: (state) => {
      return state.items[index];
    },
    set: (state, childState) => {
      if (typeof childState === 'undefined') {
        const newList = state.items.filter((_: any, i: number) => i !== index);
        return {
          ...state,
          items: newList,
        };
      }
      return {
        ...state,
        items: state.items.map((val: any, i: number) => i === index ? childState : val),
      };
    },
  };

};

export default function List<T>(sources: ISources<T>): ISinks<T> {
  const state$ = sources.onion.state$;

  const childrenSinks$ = state$.map((state) =>
    state && state.items ? state.items.map((_, i) => {
      return isolate(Item, { onion: itemLens(i) })(sources);
    }) : [],
  );

  const vdom$ = childrenSinks$
    .compose(pick('DOM'))
    .compose(mix(xs.combine))
    .map((itemVNodes) => div(itemVNodes));

  const childReducer$ = childrenSinks$
    .compose(pick('onion'))
    .compose(mix(xs.merge));

  return {
    DOM: vdom$,
    onion: childReducer$ as any as Stream<Reducer<T>>,
  };
}
