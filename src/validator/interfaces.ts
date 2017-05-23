
export interface IValidationRule {
  attributeName: string;
  message: string;
  type: string;
  validate: (payload: any) => boolean;
}

export interface IValidatorOptions {
  attributeName?: string;
  message?: string;
}

export interface IValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
