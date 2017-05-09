import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { IAction as SAction, ISelectState } from '../Select/interfaces';

export type IAction = SAction;

export interface ISelectOthersState<T> extends ISelectState<T> {
  isOthers?: boolean;
  otherValue?: string;
};

export type Reducer<T> = (state: ISelectOthersState<T>) => ISelectOthersState<T>;

export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<ISelectOthersState<T>>;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
}
