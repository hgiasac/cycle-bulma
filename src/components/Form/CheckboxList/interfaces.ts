import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
// import { IValidationRule } from '../../../validator';
import { ICheckboxState } from '../Checkbox';

export interface ICheckboxListState<T> {
  options: Array<ICheckboxState<T>>;
  itemClassName?: string;
  checkedIndexes?: number[];
  getValues?: () => T[];
}

export type Reducer<T> = (prev?: ICheckboxListState<T>) => ICheckboxListState<T>;
export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<ICheckboxListState<T>>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
}
