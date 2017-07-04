import { mockDOMSource } from '@cycle/dom';
import { mockTimeSource, timeDriver } from '@cycle/time';
import onionify from 'cycle-onionify';
import { select } from 'snabbdom-selector';
import xs from 'xstream';
import { CheckboxList } from '../src/components/Form/CheckboxList';

describe('CheckboxList', () => {

  it('Checkbox List DOM test', (done) => {

    const time = mockTimeSource();
    // const checkClick$ = Time.diagram('-|');
    const expected$ = time.diagram('4');
    const DOM = mockDOMSource({});
    // const DOM = mockDOMSource({
    //   input: {
    //     click: checkClick$,
    //   },
    // }) as any;

    function main(sources) {
      const listSinks = CheckboxList(sources);
      const parentReducer$ = xs.of((prev?) => {
        if (prev) {
          return prev;
        }

        return {
          options: [
            { value: 1, label: 'Checkbox 1'},
            { value: 2, label: 'Checkbox 2'},
            { value: 3, label: 'Checkbox 3'},
            { value: 4, label: 'Checkbox 4'},
          ],
        };
      });

      return {
        DOM: listSinks.DOM,
        onion: xs.merge(parentReducer$, listSinks.onion),
      };
    }

    const listSinks = onionify(main)({
      DOM,
      Time: timeDriver,
    });
    const reality$ = listSinks.DOM.map((vtree) => {
      const doms = select('.field', vtree);
      return doms.length;
    });

    time.assertEqual(reality$, expected$);

    time.run(done);
  });
});
