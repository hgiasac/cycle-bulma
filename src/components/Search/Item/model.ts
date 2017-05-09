import xs, { Stream } from 'xstream';
import { IAction, IState, Reducer } from './interfaces';

export default function model<T>(action$: Stream<IAction>): Stream<Reducer<T>> {

  const selectAction$ = action$
    .filter(ev => ev.type === 'select')
    .mapTo(function(prev: IState<T>): IState<T> {
      return {
        ...prev as any,
        isSelected: true
      };
    });

  const hoverAction$ = action$
    .filter(ev => ev.type === 'hover')
    .mapTo(function(prev: IState<T>): IState<T> {
      return {
        ...prev as any,
        isHovered: true,
      };
    });

  const blurAction$ = action$
    .filter(ev => ev.type === 'blur')
    .mapTo(function(prev: IState<T>): IState<T> {
      return {
        ...prev as any,
        isHovered: false,
      };
    });

  return xs.merge(selectAction$, hoverAction$, blurAction$);
}
