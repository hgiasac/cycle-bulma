import { Stream } from 'xstream';
import { IAction, Reducer } from './interfaces';

export default function model(action$: Stream<IAction>, submitReducer: Reducer): Stream<Reducer> {

  const submitReducer$ = action$
    .filter(ev => ev.type === 'submit')
    .mapTo(submitReducer);

  return submitReducer$;
}
