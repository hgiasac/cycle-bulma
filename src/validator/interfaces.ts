
export interface IValidationRule {
  type: string;
  attributeName: string;
  message: string;
  validate: (payload: any) => boolean
}

export interface IValidatorOptions {
  attributeName?: string;
  message?: string;
}

export interface IValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

