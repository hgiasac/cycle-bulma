import xs, { Stream } from 'xstream';
import { validate } from '../../../validator';
import { defaultArrayFilter, defaultFilter } from '../../Search/model';
import { IAction, IAutocompleteState, Reducer } from './interfaces';

export function AutocompleteState<T>(options?: IAutocompleteState<T>): IAutocompleteState<T> {

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
    ...options,
  };

  return state;
}

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const defaultReducer$ = xs.of((prev?: IAutocompleteState<T>): IAutocompleteState<T> => {
    if (!prev) {
      return AutocompleteState<T>();
    }

    if (prev.validators && prev.validators.length > 0) {
      prev.validators = prev.validators.map((v) => ({
        ...v,
        attributeName: prev.attributeName,
      }));
    }

    return prev;
  });

  const inputReducer$ = action$
    .filter((ev) => ev.type === 'input')
    .map((ev) => (prev: IAutocompleteState<T>): IAutocompleteState<T> => {
      const filteredOptions = defaultFilter(ev.payload, prev).slice(0, 10);
      const validationResult = validate(prev.validators, ev.payload);

      return {
        ...prev,
        currentIndex: -1,
        hoverIndex: -1,
        inputting: true,
        isListVisible: (filteredOptions && filteredOptions.length > 0),
        payload: ev.payload,
        filteredOptions,
        ...validationResult,
      };
    });

  const focusReducer$ = action$
    .filter((ev) => ev.type === 'focusInput')
    .mapTo((prev: IAutocompleteState<T>): IAutocompleteState<T> => {
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
    .map((ev) => (prev: IAutocompleteState<T>): IAutocompleteState<T> => {
      if (prev.filteredOptions[prev.hoverIndex]) {
        return prev;
      }

      const validationResult = validate(prev.validators, ev.payload);

      return {
        ...prev,
        inputFocused: true,
        inputting: false,
        isListVisible: false,
        listFocused: false,
        ...validationResult,
      };
    });

  const exitReducer$ = action$
    .filter((ev) => ev.type === 'exitInput')
    .mapTo((prev: IAutocompleteState<T>): IAutocompleteState<T> => {
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
