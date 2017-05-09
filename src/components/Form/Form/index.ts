import xs, { Stream } from 'xstream';
import isolate from '@cycle/isolate';
import { Lens } from 'cycle-onionify';
import { IFormState, IControlState, ControlSinks, IProperties, Reducer, ISources, ISinks } from './interfaces';
import view from './view';

function createControlSinks(sources: ISources, attributeName: string, control: ControlSinks) {

  const controlLens: Lens<IFormState, IControlState> = {
    get: state => state[attributeName],
    set: (state, childState) => {

      const newState = {
        ...state,
      };

      newState[attributeName] = childState;


      newState.invalidAttribute = '';

      for (let attrName in newState) {

        let controlState: IControlState = newState[attrName];
        if (controlState && typeof controlState === 'object') {
          newState.isValid = ((controlState.validators && controlState.validators.length > 0)
            || controlState.isValid !== undefined ? controlState.isValid === true : true);
          if (newState.isValid === false) {
            newState.invalidAttribute = attrName;
            break;
          }
        }

      }

      return newState;
    },
  };

  return isolate(control, { onion: controlLens })(sources);
}


function Form<T>(sources: ISources, properties: IProperties<T>): ISinks {

  const controlSinks = [];

  for (let attributeName in properties.components) {
    const sinks = typeof properties.components[attributeName] === 'function'
      ? createControlSinks(sources, attributeName, properties.components[attributeName])
      : properties.components[attributeName];
    controlSinks.push(sinks);
  }

  const state$ = sources.onion.state$;
  const reducer$ = xs.merge(
    ...controlSinks.map(s => s.onion),
  ) as Stream<Reducer>;
  const vdom$ = view(state$, controlSinks.map(s => s.DOM), properties.view, properties.controlView);

  return {
    DOM: vdom$,
    onion: reducer$,
  }
}


export {
  createControlSinks,
  IProperties,
  IFormState,
  Form
}
