import { Stream } from 'xstream';
import { IAction, Reducer } from './interfaces';

export default function model<T>(action$: Stream<IAction>, submitReducer: Reducer<T>): Stream<Reducer<T>> {

  const submitReducer$ = action$
    .filter((ev) => ev.type === 'submit')
    .mapTo(submitReducer);

  return submitReducer$;
}
