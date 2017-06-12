import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IInputAttributeEx } from '../../../dom';
import { IValidationRule } from '../../../validator';

export interface IAction {
  payload?: string;
  type: string;
}

export interface IState extends IInputAttributeEx {
  type?: string;
  className?: string;
  attributeName?: string;
  payload?: any;
  placeholder?: string;
  isDisabled?: boolean;
  validators?: IValidationRule[];
}

export type Reducer = (state: IState) => IState;

export interface ISources {
  DOM: DOMSource;
  onion: StateSource<IState>;
}

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}
