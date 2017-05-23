import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IState } from '../Item/interfaces';

export type IListState<T> = Array<IState<T>>;
export type IListReducer<T> = (prev: IListState<T>) => IListState<T>;

export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<IListState<T>>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<IListReducer<T>>;
}
