import { div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Lens, mix, pick } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { Checkbox, ICheckboxState } from '../Checkbox';
import { ICheckboxListState, ISinks, ISources, Reducer } from './interfaces';

export default function List<T>(sources: ISources<T>): ISinks<T> {

  function itemLens<T>(i: number): Lens<ICheckboxListState<T>, ICheckboxState<T>> {
    return {
      get: (state) => state.options[i],
      set: (state, childState) => {
        state.options[i] = childState;
        return {
          ...state,
          checkedIndexes: state.options.reduce((list, item, index) => {
            if (item.isChecked) {
              return list.concat([index]);
            }
            return list;
          }, []),
        };
      },
    };
  }

  const state$ = sources.onion.state$;
  const childrenSinks$ = state$.map((state) => state.options.map((_, i) =>
    isolate(Checkbox, { onion: itemLens(i) })(sources),
  ));

  const parentReducer$ = xs.of((prev?) => {

    const state = prev || {
      checkedIndexes: [],
      items: [],
    };

    if (state.itemClassName) {
      state.options.forEach((o) => {
        if (!o.className) {
          o.className = state.itemClassName;
        }
      });
    }

    if (!state.getValues) {
      state.getValues = () => state.items
        .filter((_, i) => state.checkedIndexes.indexOf(i) !== -1)
        .map((items) => items.value);
    }

    return state;
  });

  const childrenReducer$ = childrenSinks$
    .compose(pick('onion'))
    .compose(mix(xs.merge));

  const childrenDOM$ = childrenSinks$
    .compose(pick('DOM'))
    .compose(mix(xs.combine))
    .map((vnodes) => div('.checkboxes', vnodes));

  const reducer$ = xs.merge(parentReducer$, childrenReducer$);
  return {
    DOM: childrenDOM$,
    onion: reducer$ as any as Stream<Reducer<T>>,
  };
}
