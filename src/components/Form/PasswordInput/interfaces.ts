import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IInputState } from '../Input';

export interface IAction {
  payload?: string;
  type: string;
}

export interface IPasswordInputState {
  password: IInputState;
  repeatPassword: IInputState;
  isValid?: boolean;
}

export interface IPasswordInputOptions {
  minLength: number;
  maxLength: number;
  rangeMessage: string;
  matchedMessage: string;
}

export type Reducer = (state: IPasswordInputState) => IPasswordInputState;

export interface ISources {
  DOM: DOMSource;
  onion: StateSource<IPasswordInputState>;
}

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}
