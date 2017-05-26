import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { ISelectState } from '../Form/Select';

export interface ISearchState<T> extends ISelectState<T> {
  payload?: string;
  inputClass?: string;
  isListVisible?: boolean;
  inputting?: boolean;
  isLoading?: boolean;
  currentIndex?: number;
  hoverIndex?: number;
  listFocused?: boolean;
  inputFocused?: boolean;
  filteredOptions?: T[];
  placeholder?: string;
  inputContentFn?: (option: T) => any;
  contentFn?: (option: T) => any;
}

export interface ISources<T> {
  DOM: DOMSource;
  // HTTP: HTTPSource;
  onion: StateSource<ISearchState<T>>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  // HTTP: Stream<RequestInput>;
  onion: Stream<Reducer<T>>;
}

export type Reducer<T> = (prev?: ISearchState<T>) => ISearchState<T>;

export interface IAction {
  payload?: string;
  type: string;
}
