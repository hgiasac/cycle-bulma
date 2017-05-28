
export interface IReplaceParams {
  [key: string]: any;
}

/**
 * Replaces all keyword with pattern
 *
 * @param  {string} input       Input text
 * @param  {string} search      Search keyword
 * @param  {string} replacement Replacement string
 *
 * @return {string}             Result output string
 */
export function replaceAll(input: string, search: string, replacement: string): string {
  return input.replace(new RegExp(search, 'g'), replacement);
}

/**
 * Replaces list dictionary key => value with pattern
 *
 * @param  {string} input       Input text
 * @param  {Object} params      Key value params
 *
 * @return {string}             Result output string
 */
export function replaceParams(input: string, params: IReplaceParams): string {

  return Object.keys(params).reduce((result, k) => {
    const val = params[k];
    return replaceAll(result, `{{${k}}}`, val);
  }, input);
}
