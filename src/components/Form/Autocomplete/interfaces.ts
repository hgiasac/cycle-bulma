import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IValidationRule } from '../../../validator';
import { ISearchState } from '../../Search';

export interface IAutocompleteState<T> extends ISearchState<T> {
  attributeName?: string;
  placeholder?: string;
  isDisabled?: boolean;
  errorMessage?: string;
  successMessage?: string;
  iconInvalid?: string;

  validators?: IValidationRule[];
}

export type Reducer<T> = (prev?: IAutocompleteState<T>) => IAutocompleteState<T>;

export interface IAction {
  type: string;
  payload?: any;
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
