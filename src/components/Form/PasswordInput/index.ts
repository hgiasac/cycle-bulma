import { replaceParams } from '../../../util';
import intent from './intent';
import { IPasswordInputOptions, IPasswordInputState, ISinks, ISources } from './interfaces';
import model, { PasswordInputState } from './model';
import view from './view';

export {
  IPasswordInputState,
  PasswordInputState,
};

function applyOptions(options?: IPasswordInputOptions): IPasswordInputOptions {
  const minLength = options && options.minLength ? options.minLength : 5;
  const maxLength = options && options.maxLength ? options.maxLength : 20;
  const rangeMessage = options && options.rangeMessage ? options.rangeMessage
    : 'Password length must be between {{min}} and {{max}} characters';
  const matchedMessage = options && options.matchedMessage ? options.matchedMessage
    : 'Password is not matched';

  return {
    minLength,
    maxLength,
    rangeMessage: replaceParams(rangeMessage, { max: maxLength, min: minLength }),
    matchedMessage,
  };
}

export function PasswordInput(sources: ISources, options?: IPasswordInputOptions): ISinks {

  const opts = applyOptions(options);
  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$, opts);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    onion: reducer$,
  };
}
