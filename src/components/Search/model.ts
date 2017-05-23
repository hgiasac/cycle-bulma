import xs, { Stream } from 'xstream';
import { IAction, ISearchState, Reducer } from './interfaces';

export function defaultArrayFilter<T>(payload: string, item: T, state: ISearchState<T>): boolean {
  if (typeof item === 'object') {
    return item[state.valueKey].search(payload) !== -1;
  }

  return payload === item;
}

export function defaultFilter<T>(payload: string, state: ISearchState<T>): T[] {
  const data = payload ? payload.replace(/[\/\"]/g, '') : '';

  return state.options.filter((o: T) => state.filterFn(data, o, state));
}

export function SearchState<T>(options?: ISearchState<T>): ISearchState<T> {

  const state = {

    currentIndex: -1,
    filterFn: defaultArrayFilter,
    filteredOptions: [],

    hoverIndex: -1,
    inputFocused: false,
    inputting: false,
    isListVisible: false,
    listFocused: false,
    options: [],
    payload: '',
    selected: null,
  };

  if (options) {
    return Object.assign(state, options);
  }

  return state;
}

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of((prev?: ISearchState<T>): ISearchState<T> => {
    const state = Object.assign({

      currentIndex: -1,
      filterFn: defaultArrayFilter,
      filteredOptions: [],
      inputFocused: false,
      inputting: false,
      isListVisible: false,
      listFocused: false,
      options: [],
      payload: '',

      selected: null,
    }, prev || {});

    return state as any as ISearchState<T>;
  });

  const inputReducer$ = action$
    .filter((ev) => ev.type === 'input')
    .map((ev) => (prev: ISearchState<T>): ISearchState<T> => {
      const filteredOptions = defaultFilter(ev.payload, prev).slice(0, 10);

      return {
        ...prev,
        currentIndex: -1,
        hoverIndex: -1,
        inputting: true,
        isListVisible: (filteredOptions && filteredOptions.length > 0),
        payload: ev.payload,
        filteredOptions,
      };
    });

  const focusReducer$ = action$
    .filter((ev) => ev.type === 'focusInput')
    .mapTo((prev: ISearchState<T>): ISearchState<T> => {
      return {
        ...prev,
        inputFocused: true,
        inputting: true,
        isListVisible: false,
        listFocused: false,
      };
    });

  const blurReducer$ = action$
    .filter((ev) => ev.type === 'blurInput')
    .mapTo((prev: ISearchState<T>): ISearchState<T> => {
      if (prev.filteredOptions[prev.hoverIndex]) {
        return prev;
      }

      return {
        ...prev,
        inputFocused: true,
        inputting: false,
        isListVisible: false,
        listFocused: false,
      };
    });

  const exitReducer$ = action$
    .filter((ev) => ev.type === 'exitInput')
    .mapTo((prev: ISearchState<T>): ISearchState<T> => {
      return {
        ...prev,
        inputFocused: false,
        inputting: false,
        isListVisible: false,
        listFocused: false,
      };
    });

  return xs.merge(
    defaultReducer$,
    focusReducer$,
    blurReducer$,
    inputReducer$,
    exitReducer$,
  );
}
