import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IInputState } from '../Input';

export type ItemLayout<T> = (state: IItemState<T>) => VNode;
export type ListLayout<T> = (nodes: VNode[]) => VNode;

export interface IInputListState<T> {
  textInput: IInputState;
  items: Array<IItemState<T>>;
}

export interface IItemState<T> {
  content: string | VNode;
  payload: T;
}

export interface IAction {
  type: string;
  payload?: string;
}

export type Reducer<T> = (prev?: IInputListState<T>) => IInputListState<T>;

export interface IInputListProperties<T> {
  itemLayout?: ItemLayout<T>;
  listLayout?: ListLayout<T>;
}

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
