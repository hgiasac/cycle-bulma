import { button, DOMSource, span, td, tr, VNode } from '@cycle/dom';
import { Stream } from 'xstream';
import { IAction, IInputListProperties, IItemSinks, IItemSources, IItemState, ItemReducer } from './interfaces';

function intent(domSource: DOMSource): Stream<IAction> {

  const deleteAction$ = domSource.select('.delete')
    .events('click')
    .mapTo({ type: 'delete' });

  return deleteAction$;
}

function model<T>(action$: Stream<IAction>): Stream<ItemReducer<T>> {

  const deleteReducer$ = action$
    .filter((ev) => ev.type === 'delete')
    .mapTo((_: IItemState<T>): IItemState<T> => {
      return void 0;
    });

  return deleteReducer$;
}

function view<T>(state$: Stream<IItemState<T>>, properties?: IInputListProperties<T>): Stream<VNode> {

  return state$.map((state) => {

    if (properties && properties.itemLayout) {
      return properties.itemLayout(state);
    }

    return tr([
      td([ span('', state.content) ]),
      td([ button('.delete') ]),
    ]);
  });
}

export default function Item<T>(sources: IItemSources<T>, properties?: IInputListProperties<T>): IItemSinks<T> {

  const state$ = sources.onion.state$;
  const action$ = intent(sources.DOM);
  const reducer$ = model(action$);
  const vdom$ = view(state$, properties);

  return {
    DOM: vdom$,
    onion: reducer$ as any as Stream<ItemReducer<T>>,
  };
}
