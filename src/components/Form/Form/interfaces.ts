import { DOMSource, VNode } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
import { IValidationRule } from '../../../validator';

export interface IAction {
  payload?: any;
  type: string;
}

export interface IDOMDictionary {
  [key: string]: VNode;
}

export type Layout<T> = (state: T, controlDoms: IDOMDictionary) => VNode;
export interface IProperties<T> {
  components: { [key: string]: any };
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

export interface IControlState<T> {
  attributeName: string;
  payload: T;
  isValid?: boolean;
  validators?: IValidationRule[];
}

export interface IFormState {
  isValid?: boolean;
  invalidAttribute?: string;
  className?: string;
  submitText?: string;
  submitClass?: string;
  canCancel?: boolean;
  cancelFirst?: boolean;
  cancelText?: string;
  cancelClass?: string;
}

export type Reducer<T extends IFormState> = (state: T) => T;

export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<T>;
  HTTP?: HTTPSource;
}

export interface ISinks<T extends IFormState> {
  action$: Stream<IAction>;
  controlSinks: Array<IControlSinks<T>>;
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
  HTTP?: Stream<RequestOptions>;
}

export interface IControlSinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
  HTTP?: Stream<RequestOptions>;
}

export type ControlComponent<T> = (sources: ISources<T>) => IControlSinks<T>;
