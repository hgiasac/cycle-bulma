import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

export interface IAction {
  type: string;
  payload: boolean;
}

export interface IState {
  payload: boolean;
  label: string;
};

export interface ISources {
  DOM: DOMSource;
  onion: StateSource<IState>;
}

export type Reducer = (prev?: IState) => IState;

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}
