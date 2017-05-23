import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import {
  ControlComponent, IControlSinks, IControlState, IDOMDictionary, IFormState,
  IProperties, ISinks, ISources, Reducer } from './interfaces';
import view, { renderButtons } from './view';

function createControlSinks<T>(sources: ISources<T>, attributeName: string, control: ControlComponent<any>) {

  const controlLens: Lens<IFormState, IControlState<any>> = {
    get: (state) => {
      if (state[attributeName] && !state[attributeName].attributeName) {
        state[attributeName].attributeName = attributeName;
      }
      return state[attributeName];
    },
    set: (state, childState) => {

      const newState = {
        ...state,
      };

      newState[attributeName] = childState;

      newState.invalidAttribute = '';

      Object.keys(newState).every((attrName) => {

        const controlState = newState[attrName];
        if (controlState && typeof controlState === 'object') {
          newState.isValid = ((controlState.validators && controlState.validators.length > 0)
            || controlState.isValid !== undefined ? controlState.isValid === true : true);
          if (newState.isValid === false) {
            newState.invalidAttribute = attrName;
            return false;
          }
        }
        return true;
      });

      return newState;
    },
  };

  return isolate(control, { onion: controlLens })(sources);
}

function Form<T>(sources: ISources<T>, properties: IProperties<T>): ISinks<T> {

  const controlSinks: Array<IControlSinks<any>> = Object.keys(properties.components).map((attributeName) => {
    return typeof properties.components[attributeName] === 'function'
      ? createControlSinks(sources, attributeName, properties.components[attributeName])
      : properties.components[attributeName];
  });

  const state$ = sources.onion.state$;
  const reducer$ = xs.merge(
    ...controlSinks.map((s) => s.onion),
  ) as Stream<Reducer<T>>;
  const http$$ = controlSinks.filter((s) => s.HTTP)
    .map((s) => s.HTTP);

  const http$ = http$$ && http$$.length > 0 ? xs.merge(...http$$) : null;
  const vdom$ = view(state$, controlSinks.map((s) => s.DOM), properties.layout);

  return {
    controlSinks,
    DOM: vdom$,
    HTTP: http$,
    onion: reducer$,
  };
}

export {
  createControlSinks,
  IProperties,
  IFormState,
  Form,
  renderButtons as renderFormButtons,
  ISinks as IFormSinks,
  ISources as IFormSources,
  Reducer as FormReducer,
  IDOMDictionary,
};
