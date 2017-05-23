import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';

export interface IAction {
  payload?: string;
  type: string;
}

export interface IState<T> {
  option: T;
  optionContent: any;
  isSelected: boolean;
  isHovered: boolean;
}

export type Reducer<T> = (prev: IState<T>) => IState<T>;

export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<T>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
}
