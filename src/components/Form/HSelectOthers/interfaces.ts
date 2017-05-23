import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';

export interface IState {
  options: any;
  payload?: any;
  selected?: any;
  isOthers?: boolean;
  contentKey?: any;
  valueKey?: string;
  otherValue?: string;
  filterFn?: (payload: string, o: object, prev: IState) => boolean;
}

export type Reducer = (prev?: IState) => IState | undefined;

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}

export interface IAction {
  type: string;
  payload: string;
}

export interface ISources {
  DOM: DOMSource;
  onion: StateSource<IState>;
}
