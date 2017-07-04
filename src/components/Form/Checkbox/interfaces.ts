import { DOMSource, VNode } from '@cycle/dom';
import { TimeSource } from '@cycle/time';
import { StateSource } from 'cycle-onionify';
import { Stream } from 'xstream';
// import { IValidationRule } from '../../../validator';

export interface IAction {
  type: string;
  payload: boolean;
}

export type CheckboxLabelView = () => VNode;

export interface ICheckboxState<T> {
  isChecked?: boolean;
  isDisabled?: boolean;
  className?: boolean;
  label: string | CheckboxLabelView;
  value: T;
}

export type Reducer<T> = (prev?: ICheckboxState<T>) => ICheckboxState<T>;
export interface ISources<T> {
  DOM: DOMSource;
  onion: StateSource<ICheckboxState<T>>;
  Time: TimeSource;
}

export interface ISinks<T> {
  DOM: Stream<VNode>;
  onion: Stream<Reducer<T>>;
}
