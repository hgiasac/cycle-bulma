import { mockDOMSource } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import onionify from 'cycle-onionify';
import {select} from 'snabbdom-selector';
// import xs from 'xstream';
import { Checkbox } from '../src/components/Form/Checkbox';

describe('Checkbox', () => {

  it('Checkbox checked events', (done) => {

    const Time = mockTimeSource();
    const checkClick$ = Time.diagram('----x---y---x---y--|', {
      x: { target: { checked: true } },
      y: { target: { checked: false } },
    });
    const expected$ = Time.diagram('f-------------t---f---t---f--|', { f: false, t: true });

    const DOM = mockDOMSource({
      input: {
        click: checkClick$,
      },
    }) as any;

    const checkbox = onionify(Checkbox)({ DOM, Time });
    const reality$ = checkbox.DOM.map((vtree) => {
      const doms = select('input', vtree);
      return doms[0].data.attrs.checked;
    });

    Time.assertEqual(reality$, expected$);

    Time.run(done);
  });
});
