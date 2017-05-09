import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { IValidationRule } from '../../../validator';
import { ISelectAttribute } from '../../../dom';

export interface IAction {
  payload?: string | null;
  type: string;

}

export interface ISelectState<T> extends ISelectAttribute<T> {
  attributeName?: string;
  payload?: any;
  isDisabled?: boolean;
  validators?: IValidationRule[];
  filterFn?: (payload: string, o: T, prev: ISelectState<T>) => boolean;
};

export type Reducer<T> = (state: ISelectState<T>) => ISelectState<T>;

export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<ISelectState<T>>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
}
