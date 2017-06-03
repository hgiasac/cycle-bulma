import xs, { Stream } from 'xstream';
import { InputState } from '../Input';
import { IAction, IPasswordInputOptions, IPasswordInputState, Reducer } from './interfaces';

export function PasswordInputState(options?: IPasswordInputState): IPasswordInputState {
  const state = {
    password: InputState(),
    repeatPassword: InputState(),
  };

  if (options) {
    return {
      password: {
        ...state.password,
        ...options.password,
      },
      repeatPassword: {
        ...state.repeatPassword,
        ...options.repeatPassword,
      },
    };
  }

  return state;
}

function validateMatchedPassword(prev: IPasswordInputState, options: IPasswordInputOptions): IPasswordInputState {
  const isValid = (prev.password.payload === prev.repeatPassword.payload);
  if (!isValid) {
    return {
      ...prev,
      isValid,
      password: {
        ...prev.password,
        isValid,
        errorMessage: options.matchedMessage,
      },
    };
  }

  return {
    ...prev,
    isValid,
    password: {
      ...prev.password,
      isValid,
    },
  };
}

export default function model(action$: Stream<IAction>, options: IPasswordInputOptions): Stream<Reducer> {

  const defaultReducer$ = xs.of((prev: IPasswordInputState): IPasswordInputState => {

    if (prev) {
      return prev;
    }

    return PasswordInputState();
  });

  const passwordBlurReducer$ = action$
    .filter((ev) => ev.type === 'blurPassword')
    .map((ev) => (prev?: IPasswordInputState): IPasswordInputState => {
      const isValid = ev.payload.length >= options.minLength
        && (ev.payload.length <= options.maxLength);
      if (!isValid) {
        return {
          ...prev,
          isValid,
          password: {
            ...prev.password,
            isValid,
            errorMessage: options.rangeMessage,
            payload: ev.payload,
          },
        };
      }
      prev.password.payload = ev.payload;
      return validateMatchedPassword(prev, options);
    });

  const repeatPasswordBlurReducer$ = action$
    .filter((ev) => ev.type === 'blurRepeatPassword')
    .map((ev) => (prev: IPasswordInputState): IPasswordInputState => {
      prev.repeatPassword.payload = ev.payload;
      return validateMatchedPassword(prev, options);
    });

  return xs.merge(defaultReducer$, passwordBlurReducer$, repeatPasswordBlurReducer$);

}
