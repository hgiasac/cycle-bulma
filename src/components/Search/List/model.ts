import { Stream } from 'xstream';
import { IAction, ISearchState, Reducer } from '../interfaces';

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const outFocusAction$ = action$
    .filter((ev) => ev.type === 'outfocusList')
    .mapTo((prev: ISearchState<T>): ISearchState<T> => {
      return {
        ...prev,
        isListVisible: false,
        listFocused: false,
      };
    });

  return outFocusAction$;
}
