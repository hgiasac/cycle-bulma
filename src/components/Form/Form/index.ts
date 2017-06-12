import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import xs, { Stream } from 'xstream';
import intent from './intent';
import { ControlComponent, IControlSinks, IControlState, IDOMDictionary, IFormState,
  IProperties, ISinks, ISources, Reducer } from './interfaces';
import model, { validateForm } from './model';
import view, { renderButtons } from './view';

function createControlSinks<T>(sources: ISources<T>, attributeName: string,
                               control: ControlComponent<any>, properties?: any) {

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

      validateForm(newState);

      return newState;
    },
  };

  return isolate(control, { onion: controlLens })(sources, properties);
}

function Form<T>(sources: ISources<T>, properties: IProperties<T>): ISinks<T> {

  const controlSinks: Array<IControlSinks<any>> = Object.keys(properties.components).map((attributeName) => {
    if (typeof properties.components[attributeName] === 'function') {
      return createControlSinks(sources, attributeName, properties.components[attributeName]);
    } else if (properties.components[attributeName].onion) {
      return properties.components[attributeName];
    }

    return createControlSinks(
      sources, attributeName,
      properties.components[attributeName].component,
      properties.components[attributeName].properties,
    );
  });

  const state$ = sources.onion.state$;
  const action$ = intent(sources);
  const parentReducer$ = model(action$);
  const reducer$ = xs.merge(parentReducer$,
    ...controlSinks.map((s) => s.onion),
  ) as Stream<Reducer<T>>;
  const http$$ = controlSinks.filter((s) => s.HTTP)
    .map((s) => s.HTTP);

  const http$ = http$$ && http$$.length > 0 ? xs.merge(...http$$) : null;
  const vdom$ = view(state$, controlSinks.map((s) => s.DOM), properties);

  return {
    action$,
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
  validateForm,
};
