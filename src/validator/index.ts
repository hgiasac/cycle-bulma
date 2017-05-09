import { IValidationResult, IValidationRule, IValidatorOptions } from './interfaces';

function validate(validators: IValidationRule[], payload: any): IValidationResult {

  let isValid = true;
  let errorMessage = '';
  if (validators && validators.length > 0) {

    isValid = validators.every(v => {
      if (!v.validate(payload)) {
        errorMessage = v.message;
        return false;
      }
      return true;
    });
  }

  return {
    isValid,
    errorMessage
  }
}

function RequiredValidator(options?: IValidatorOptions): IValidationRule {

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
    attributeName: attributeName,
    type: 'required',
    message: message,
    validate: function (payload: any): boolean {
      return payload !== null && payload !== undefined && payload !== '';
    }
  }
}

export {
  IValidatorOptions,
  IValidationResult,
  IValidationRule,
  RequiredValidator,
  validate,
}
