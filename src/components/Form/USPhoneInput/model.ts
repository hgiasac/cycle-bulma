import xs, { Stream } from 'xstream';
import { USPhoneValidator, validate } from '../../../validator';
import { IAction, IUSPhoneInputState, Reducer } from './interfaces';

export function USPhoneInputState(options?: IUSPhoneInputState): IUSPhoneInputState {
  return {
    errorMessage: 'Phone number is invalid',
    required: false,
    ...options,
  };
}

export default function model(action$: Stream<IAction>): Stream<Reducer> {
  const phoneValidator = USPhoneValidator();

  const firstRegex = /^\(?([0-9]{3})\)?/i;

  const defaultReducer$ = xs.of((prev: IUSPhoneInputState): IUSPhoneInputState => {
    if (!prev) {
      return USPhoneInputState();
    }

    if (typeof prev !== 'object') {
      return USPhoneInputState({
        payload: prev,
      });
    }

    prev.validators = prev.validators || [];
    prev.validators.push(phoneValidator);
    prev.validators = prev.validators.map((v) => ({
      ...v,
      attributeName: prev.attributeName,
    }));
    return prev;
  });

  const inputReducer$ = action$
    .filter((ev) => ev.type === 'input')
    .map((ev) => (prev: IUSPhoneInputState): IUSPhoneInputState => {
      let payload = ev.payload;
      let remain = ev.payload;
      if (ev.payload.length < 3) {
        return {
          ...prev,
          payload: ev.payload,
        };
      }

      const firstResult = firstRegex.exec(ev.payload);
      if (!firstResult) {
        return {
          ...prev,
          payload,
        };
      }
      const resultText = firstResult[firstResult.length - 1];
      payload = '(' + resultText + ') ';
      remain = ev.payload.slice(firstResult[0].length);

      if (remain.length) {

        if (remain[0] === '-' || remain[0] === ' ') {
          remain = remain.slice(1);
        }
        if (remain.length) {
          payload += remain.slice(0, 3) + (remain.length > 3 ? '-' : '');
          if (remain.length > 3) {
            remain = [' ', '-'].indexOf(remain[3]) !== -1 ? remain.slice(4) : remain.slice(3);
            payload += remain;
          }
        }
      }
      return {
        ...prev,
        payload,
      };
  });

  const blurReducer$ = action$
    .filter((ev) => ev.type === 'blur')
    .map((ev) => (prev: IUSPhoneInputState): IUSPhoneInputState => {

      const validationResult = validate(prev.validators, ev.payload);

      return {
        ...prev,
        payload: ev.payload,
        ...validationResult,
      };
    });

  return xs.merge(defaultReducer$, inputReducer$, blurReducer$);

}
