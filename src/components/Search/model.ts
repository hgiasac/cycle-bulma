import xs, { Stream } from 'xstream';
import { IItemState } from './Item';
import { IAction, Reducer, ISearchState } from './interfaces';

export function defaultArrayFilter<T>(payload: string, item: IItemState<T>, state: ISearchState<T>): boolean {
  if (typeof item === 'object') {
    return item[state.valueKey].search(payload) !== -1;
  }

  return payload === item;
}

export function defaultFilter<T>(payload: string, state: ISearchState<T>): T[] {
  const data = payload ? payload.replace(/[\/\"]/g, '') : '';

  return state.options.filter((o: T) => state.filterFn(data, o, state));
}

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of(function(prev?: ISearchState<T>): ISearchState<T> {
    const state = Object.assign({

      filteredOptions: [],
      payload: '',

      inputting: false,
      isListVisible: false,
      listFocused: false,
      inputFocused: false,
      currentIndex: -1,
      options: [],
      selected: null,
      filterFn: defaultArrayFilter,
    }, prev || {});

    return state as any as ISearchState<T>;
  });

  const inputReducer$ = action$
    .filter(ev => ev.type === 'input')
    .map(ev => function(prev: ISearchState<T>): ISearchState<T> {
      const filteredOptions = defaultFilter(ev.payload, prev).slice(0, 10);

      return {
        ...prev,
        inputting: true,
        currentIndex: -1,
        hoverIndex: -1,
        payload: ev.payload,
        isListVisible: (filteredOptions && filteredOptions.length > 0),
        filteredOptions: filteredOptions,
      }
    });

  const focusReducer$ = action$
    .filter(ev => ev.type === 'focusInput')
    .mapTo(function(prev: ISearchState<T>): ISearchState<T> {
      return {
        ...prev,
        inputting: true,
        inputFocused: true,
        listFocused: false,
        isListVisible: false,
      }
    });

  const blurReducer$ = action$
    .filter(ev => ev.type === 'blurInput')
    .mapTo(function(prev: ISearchState<T>): ISearchState<T> {
      if (prev.filteredOptions[prev.hoverIndex]) {
        return prev;
      }

      return {
        ...prev,
        inputting: false,
        inputFocused: true,
        listFocused: false,
        isListVisible: false,
      }
    });

  const exitReducer$ = action$
    .filter(ev => ev.type === 'exitInput')
    .mapTo(function (prev: ISearchState<T>): ISearchState<T> {
      return {
        ...prev,
        inputting: false,
        inputFocused: false,
        listFocused: false,
        isListVisible: false,
      }
    });

  return xs.merge(
    defaultReducer$,
    focusReducer$,
    blurReducer$,
    inputReducer$,
    exitReducer$
  );
}
