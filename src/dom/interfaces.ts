
export interface ISelectAttribute<T> {
  hasContainer?: boolean;
  containerClass?: string;
  className?: string;
  isGrouped?: boolean;
  value?: any;
  selected?: T | any;
  options: T[] | any;
  label?: string;
  valueKey?: string;
  contentKey?: any;
  prompt?: string;
  size?: string;
  help?: string;
  helpSuccess?: string;
  helpWarning?: string;
  iconLeft?: string;
  iconRight?: string;
  isValid?: boolean;
  iconSuccess?: string;
  iconWarning?: string;
}

export interface ICheckboxAttirbute {
  hasContainer?: boolean;
  containerClass?: string;
  label: string;
  value?: string;
  checked?: boolean;
}

export interface IInputAttributeEx {
  hasContainer?: boolean;
  containerClass?: string;
  isGrouped?: boolean;
  label?: string;
  size?: string;
  help?: string;
  successMessage?: string;
  errorMessage?: string;
  iconLeft?: string;
  iconRight?: string;
  isValid?: boolean;
  iconSuccess?: string;
  iconInvalid?: string;
}
