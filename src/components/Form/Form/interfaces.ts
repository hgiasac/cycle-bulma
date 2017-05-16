import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { HTTPSource, RequestInput } from '@cycle/http';
import { StateSource } from 'cycle-onionify';
import { IValidationRule } from '../../../validator';

export interface IAction {
  payload?: string;
  type: string;
}

export type Layout<T> = (state: T, controlDoms: VNode[]) => VNode;
export interface IProperties<T> {
  components: any;
  layout?: Layout<T>;
}

export interface IButtonProperties {

  isValid?: boolean;
  submitText?: string;
  submitClass?: string;
  canCancel?: boolean;
  cancelFirst?: boolean;
  cancelText?: string;
  cancelClass?: string;
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
  className?: string;
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
  HTTP?: HTTPSource;
}

export interface ItemSinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
  HTTP?: Stream<RequestInput>;
}

export interface ISinks {
  DOM: Stream<VNode>;
  onion: Stream<Reducer>;
  controlSinks: ItemSinks[];
  HTTP?: Stream<RequestInput>;
}
