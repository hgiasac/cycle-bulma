import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IInputAttributeEx } from '../../../dom';
import { IValidationRule } from '../../../validator';

export interface IAction {
  payload?: string;
  type: string;
}

export interface IUSPhoneInputState extends IInputAttributeEx {
  attributeName?: string;
  payload?: any;
  placeholder?: string;
  isDisabled?: boolean;
  invalidPhoneMessage?: string;
  validators?: IValidationRule[];

}

export type Reducer = (state: IUSPhoneInputState) => IUSPhoneInputState;

export interface ISources {
  DOM: DOMSource;
  onion: StateSource<IUSPhoneInputState>;
}

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}
