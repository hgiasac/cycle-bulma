import { Stream } from 'xstream';
import { validate } from '../../../validator';
import { IAction, IFormState, Reducer } from './interfaces';

export default function model<T extends IFormState>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const invalidReducer$ = action$
    .filter((ev) => ev.type === 'onValidate' && !ev.payload)
    .mapTo((prev): T => {
      return {
        ...prev,
        isValid: false,
      };
    });

  return invalidReducer$;
}

export function validateForm(state: IFormState, revalidate?: boolean) {
  state.invalidAttribute = '';

  Object.keys(state).every((attrName) => {

    let controlState = state[attrName];
    if (controlState && typeof controlState === 'object') {
      const hasValidators = controlState.validators && controlState.validators.length > 0;
      if (revalidate && hasValidators) {
        const validationResults = validate(controlState.validators, controlState.payload);
        controlState = {
          ...controlState,
          ...validationResults,
        };
      }

      state.isValid = !hasValidators || controlState.isValid;
      if (!state.isValid && controlState.isValid === undefined) {
        state.isValid = controlState.validators.every((v) => v.type !== 'required');
      }

      if (state.isValid === false) {
        state.invalidAttribute = attrName;
        return false;
      }
    }
    return true;
  });
}
