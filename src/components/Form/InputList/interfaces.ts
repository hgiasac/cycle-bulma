import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { IInputState } from '../Input';

export interface IInputListState<T> {
  textInput: IInputState;
  items: Array<IItemState<T>>;
}

export interface IItemState<T> {
  payload: T;
  content: string | VNode;
};

export interface IAction {
  type: string;
  payload?: string;
}

export type Reducer<T> = (prev?: IInputListState<T>) => IInputListState<T>;

export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<IInputListState<T>>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
}

export type ItemReducer<T> = (prev?: IItemState<T>) => IItemState<T>;

export interface IItemSources<T> {
  DOM: DOMSource;
  onion: StateSource<IItemState<T>>;
}

export interface IItemSinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<ItemReducer<T>>;
}
