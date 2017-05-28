import { div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Lens, mix, pick } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import { validate } from '../../../validator';
import intent from '../../Search/intent';
import Item, { IItemState } from '../../Search/Item';
import model from '../../Search/model';
import { IAutocompleteState, ISinks, ISources, Reducer } from './interfaces';

const itemLens = <T>(index: number): Lens<IAutocompleteState<T>, IItemState<T>> => {
  return {
    get: (state: IAutocompleteState<T>): IItemState<T> => ({
      isHovered: state.hoverIndex === index,
      isSelected: state.currentIndex === index,
      option: state.filteredOptions[index],
      optionContent: state.contentFn ? state.contentFn(state.filteredOptions[index])
        : state.filteredOptions[index],
    }),
    set: (state, childState) => {
      if (childState.isSelected && state.currentIndex !== index) {
        const payload = state.inputContentFn ? state.inputContentFn(childState.option)
          : childState.optionContent;
        const validationResult = validate(state.validators, payload);

        return {
          ...state,
          currentIndex: index,
          hoverIndex: -1,
          inputFocused: false,
          inputting: false,
          isListVisible: false,
          listFocused: false,
          payload,
          selected: state.filteredOptions[index],
          ...validationResult,
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
