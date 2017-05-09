import { Stream } from 'xstream';
import { IAction, ISearchState, Reducer } from '../interfaces';

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const outFocusAction$ = action$
    .filter(ev => ev.type === 'outfocusList')
    .mapTo(function(prev: ISearchState<T>): ISearchState<T> {
      return {
        ...prev,
        listFocused: false,
        isListVisible: false,
      }
    });

  return outFocusAction$;
}
