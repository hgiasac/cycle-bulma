import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { IValidationRule } from '../../../validator';

export interface IAction {
  payload?: string;
  type: string;
}

export type View<T> = (state: T, vdom: VNode) => VNode;
export type ControlView<T> = (state: T, controlDoms: VNode[]) => VNode;

export interface IProperties<T> {
  components: any;
  view?: View<T>;
  controlView?: ControlView<T>;
}

export interface IControlState {
  attributeName: string;
  payload: any;
  isValid?: boolean;
  validators?: IValidationRule[];
}

export interface IFormState {
  isValid?: boolean;
  invalidAttribute: string;
  submitText?: string;
  submitClass?: string;
  canCancel?: boolean;
  cancelFirst?: boolean;
  cancelText?: string;
  cancelClass?: string;
}

export type ControlSinks = (sources: ISources) => ISinks;
export type Reducer = (state: IFormState) => IFormState;

export interface ISources {
  DOM: DOMSource;
  onion: StateSource<any>;
}

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
}
