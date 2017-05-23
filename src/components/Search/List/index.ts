import { div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Lens, mix, pick } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { ISearchState, ISinks, ISources, Reducer } from '../interfaces';
import Item, { IItemState } from '../Item';
import intent from './intent';
import model from './model';

const itemLens = <T>(index: number): Lens<ISearchState<T>, IItemState<T>> => {
  return {
    get: (state: ISearchState<T>): IItemState<T> => ({
      isHovered: state.hoverIndex === index,
      isSelected: state.currentIndex === index,
      option: state.filteredOptions[index],
      optionContent: state.contentFn ? state.contentFn(state.filteredOptions[index])
        : state.filteredOptions[index],
    }),
    set: (state, childState) => {
      if (childState.isSelected && state.currentIndex !== index) {
        return {
          ...state,
          currentIndex: index,
          hoverIndex: -1,
          inputFocused: false,
          inputting: false,
          isListVisible: false,
          listFocused: false,
          payload: childState.optionContent,
          selected: state.filteredOptions[index],
        };
      }

      if (childState.isHovered && state.hoverIndex !== index) {
        return {
          ...state,
          hoverIndex: index,
          inputFocused: false,
          isListVisible: true,
          listFocused: true,
        };
      }

      if (!childState.isHovered && state.hoverIndex === index) {
        return {
          ...state,
          hoverIndex: -1,
          listFocused: false,
        };
      }

      return state;
    },
  };
};

export default function List<T>(sources: ISources<T>): ISinks<T> {

  const state$ = sources.onion.state$;

  const childrenSinks$ = state$.map((state) =>
    state.filteredOptions.map((_, i) => {
      return isolate(Item, { onion: itemLens(i)})(sources);
    }),
  );

  const vdom$ = childrenSinks$
    .compose(pick((sinks) => sinks.DOM))
    .compose(mix(xs.combine))
    .map((itemVNodes) => {
      const results =  div('.results', itemVNodes);
      return results;
    });

  const itemReducer$ = childrenSinks$
    .compose(pick((sinks) => sinks.onion))
    .compose(mix(xs.merge));

  const action$ = intent(sources.DOM);
  const listReducer$ = model(action$);
  const reducer$ = xs.merge(listReducer$, itemReducer$);

  return {
    DOM: vdom$,
    onion: reducer$ as Stream<Reducer<T>>,
  };
}
