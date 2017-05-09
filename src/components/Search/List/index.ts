import xs, { Stream } from 'xstream';
import isolate from '@cycle/isolate';
import { div} from '@cycle/dom';
import { Lens, pick, mix } from 'cycle-onionify';
import Item, { IItemState } from '../Item';
import { ISearchState, ISources, ISinks, Reducer } from '../interfaces';
import intent from './intent';
import model from './model';

const itemLens = function <T>(index: number): Lens<ISearchState<T>, IItemState<T>> {
  return {
    get: function(state: ISearchState<T>): IItemState<T> {
      return {
        option: state.filteredOptions[index],
        isSelected: state.currentIndex === index,
        isHovered: state.hoverIndex === index,
        optionContent: state.contentFn ? state.contentFn(state.filteredOptions[index])
          : state.filteredOptions[index]
      } as any as IItemState<T>;
    },
    set: (state, childState) => {
      if (childState.isSelected && state.currentIndex !== index) {
        return {
          ...state,
          currentIndex: index,
          selected: state.filteredOptions[index],
          inputting: false,
          hoverIndex: -1,
          payload: childState.optionContent,
          isListVisible: false,
          listFocused: false,
          inputFocused: false,
        };
      }

      if (childState.isHovered && state.hoverIndex !== index) {
        return {
          ...state,
          hoverIndex: index,
          isListVisible: true,
          listFocused: true,
          inputFocused: false,
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
    }
  };
}

export default function List<T>(sources: ISources<T>): ISinks<T> {

  const state$ = sources.onion.state$;

  const childrenSinks$ = state$.map(state =>
    state.filteredOptions.map((_, i) => {
      return isolate(Item, { onion: itemLens(i)})(sources);
    })
  );

  const vdom$ = childrenSinks$
    .compose(pick(sinks => sinks.DOM))
    .compose(mix(xs.combine))
    .map(itemVNodes => {
      const results =  div('.results', itemVNodes);
      return results;
    });

  const itemReducer$ = childrenSinks$
    .compose(pick(sinks => sinks.onion))
    .compose(mix(xs.merge));

  const action$ = intent(sources.DOM);
  const listReducer$ = model(action$);
  const reducer$ = xs.merge(listReducer$, itemReducer$);

  return {
    DOM: vdom$,
    onion: reducer$ as Stream<Reducer<T>>,
  };
}
