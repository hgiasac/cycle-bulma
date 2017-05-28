import { IValidationResult, IValidationRule, IValidatorOptions } from './interfaces';
export * from './interfaces';

export function validate(validators: IValidationRule[], payload: any): IValidationResult {

  let isValid = true;
  let errorMessage = '';
  if (validators && validators.length > 0) {

    isValid = validators.every((v) => {
      if (!v.validate(payload)) {
        errorMessage = v.message;
        return false;
      }
      return true;
    });
  }

  return {
    errorMessage,
    isValid,
  };
}

export function RequiredValidator(options?: IValidatorOptions): IValidationRule {

  const defaultMessage = ' is required';
  let attributeName = '';
  let message = 'Field' + defaultMessage;
  if (options) {
    if (options.message) {
      message = options.message;
    } else if (options.attributeName) {
      attributeName = options.attributeName;
      message = options.attributeName + defaultMessage;
    }
  }
  return {
    attributeName,
    type: 'required',
    message,
    validate: (payload: any): boolean => {
      return payload !== null && payload !== undefined && payload !== '';
    },
  };
}

export function getInvalidMessage(options: IValidatorOptions, defaultMessage: string): string {
  if (options.message) {
    return options.message;
  }
  if (options.attributeName) {
    return options.attributeName + defaultMessage;
  }

  return defaultMessage;
}

export interface IRegexValidatorOptions extends IValidatorOptions {
  regex: RegExp;
}

export function RegexValidator(options: IRegexValidatorOptions): IValidationRule {

  const defaultMessage = ' must be in format "' + options.regex.toString() + '"';
  const attributeName = '';

  const message = getInvalidMessage(options, defaultMessage);

  return {
    attributeName,
    type: 'regex',
    message,
    validate: (payload: any): boolean => {
      return !payload || options.regex.test(payload);
    },
  };
}

export function EmailValidator(options?: IRegexValidatorOptions): IValidationRule {

  const defaultMessage = 'Your email address is invalid';
  const attributeName = '';
  // tslint:disable
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  // tslint:enable
  const opts = { ...options };
  return {
    attributeName,
    message: opts.message || defaultMessage,
    type: 'email',
    validate: (payload: any): boolean => {
      return !payload || regex.test(payload);
    },
  };
}

export function USPhoneValidator(options?: IValidatorOptions): IValidationRule {

  const defaultMessage = 'Your phone number is invalid';
  const attributeName = '';
  // tslint:disable
  const regex = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/i;
  // tslint:enable
  const opts = { ...options };
  return {
    attributeName,
    message: opts.message || defaultMessage,
    type: 'phone_us',
    validate: (payload: any): boolean => {
      return !payload || regex.test(payload);
    },
  };
}
