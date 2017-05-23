import {
  button, div, figure,
  i, img, input as rawInput,
  label, option, p,
  select as rawSelect, span,
  textarea as rawTextarea, VNode,
} from '@cycle/dom';
import {
  ICheckboxAttirbute,
  IInputAttributeEx,
  ISelectAttribute,
} from './interfaces';

export function select<T>(selector: string, attrs: ISelectAttribute<T>, children?: any): VNode | VNode[] {

  const valueKey = attrs.valueKey || 'value';
  const textKey = attrs.contentKey || 'content';

  let options = attrs.prompt ? [option({
    attrs: {
      selected: attrs.value === '' || attrs.value === null,
      value: '',
    },
  }, attrs.prompt)] : [];

  if (attrs.options) {
    if (Array.isArray(attrs.options)) {
      options = options.concat(attrs.options.map((o) => option({
        attrs: {
          selected: o[valueKey] === (attrs.selected ? attrs.selected[valueKey] : attrs.value),
          value: o[valueKey],
        },
      }, typeof textKey === 'function' ? textKey(o) : o[textKey])));
    } else if (typeof attrs.options === 'object') {
      Object.keys(attrs.options).forEach((key) => {
        options.push(option({
          attrs: {
            selected: key === (attrs.selected ? attrs.selected : attrs.value),
            value: key,
          },
        }, attrs.options[key]));
      });
    }
  }

  const selectClass = '.select' + (attrs.isValid === true ? '.is-success' : (attrs.isValid === false ? '.is-danger' : ''));

  const vSelect = span(selectClass, [
    rawSelect(selector, options),
  ]);
  return commonControl(vSelect, attrs, children);
}

function commonControl(vnode: VNode, opts?: IInputAttributeEx, children?: any): VNode | VNode[] {

  const attrs = Object.assign({
    hasContainer: true,
  }, opts || {});

  const vnodes = [];

  const controlClass = '.control'
    + (attrs.iconLeft ? '.has-icons-left' : '')
    + (((attrs.isValid && attrs.iconSuccess) || (attrs.isValid === false && attrs.iconInvalid))
      || attrs.iconRight ? '.has-icons-right' : '');

  const childNodes = [
    vnode,
  ];

  if (attrs.iconLeft) {
    childNodes.push(span(
      '.icon.is-left' + (attrs.size || ''),
      i(attrs.iconLeft),
    ));
  }

  let helpNode;

  if (attrs.isValid !== undefined && attrs.isValid !== null) {
    if (attrs.isValid) {
      if (attrs.iconSuccess) {
        childNodes.push(span(
          '.icon.is-right' + (attrs.size || ''),
          i(attrs.iconSuccess),
        ));
      }

      if (attrs.successMessage) {
        helpNode = p('.help.is-success', attrs.successMessage);
      }
    } else if (attrs.isValid === false) {
      if (attrs.iconInvalid) {
        childNodes.push(span(
          '.icon.is-right' + (attrs.size || ''),
          i(attrs.iconInvalid),
        ));
      }

      if (attrs.errorMessage) {
        helpNode = p('.help.is-danger', attrs.errorMessage);
      }
    }
  } else if (attrs.iconRight) {
    childNodes.push(span(
      '.icon.is-left' + (attrs.size || ''),
      i(attrs.iconLeft),
    ));
  }

  if (!helpNode && attrs.help) {
    helpNode = p('.help', attrs.help);
  }

  if (attrs.label) {
    if (attrs.isGrouped) {
      childNodes.unshift(label('.label', attrs.label));
    } else {
      vnodes.push(label('.label', attrs.label));
    }
  }
  vnodes.push(p(controlClass, childNodes));
  if (helpNode) {
    vnodes.push(helpNode);
  }

  if (children) {
    if (Array.isArray(children)) {
      vnodes.push(...children);
    } else {
      vnodes.push(children);
    }

  }

  return (attrs.hasContainer && !attrs.isGrouped) ? div((attrs.containerClass || ''), vnodes) : vnodes;

}

export function input(selector: string, inputAttrs: any, opts?: IInputAttributeEx, children?: any): VNode | VNode[] {

  const attrs = Object.assign({
    hasContainer: true,
    iconSuccess: '.fa.fa-check',
    iconWarning: '.fa.fa-warning',
  }, opts || {});

  const inputClass = '.input'
    + (attrs.size || '')
    + (attrs.isValid === true ? '.is-success' : '')
    + (attrs.isValid === false ? '.is-danger' : '');

  const vnode = rawInput(selector + inputClass, inputAttrs);

  return commonControl(vnode, attrs, children);
}

export function textarea(selector: string, inputAttrs: any, opts?: IInputAttributeEx, children?: any): VNode | VNode[] {

  const attrs = opts || {};
  const inputClass = '.textarea'
    + (attrs.size || '')
    + (attrs.isValid === true ? '.is-success' : '')
    + (attrs.isValid === false ? '.is-danger' : '');

  const vnode = rawTextarea(selector + inputClass, inputAttrs);

  return commonControl(vnode, attrs, children);
}

export function checkbox(selector: string, attrs: ICheckboxAttirbute, children?: any): VNode {

  const vnode = p('.control', [
    label('.checkbox', [
      rawInput(selector, {
        props: {
          checked: attrs.checked,
          type: 'checkbox',
          value: attrs.value,
        },
      }),
      attrs.label ? ' ' + attrs.label : null,

    ].concat(children)),
  ]);

  return attrs.hasContainer ? div('.field' + (attrs.containerClass || ''), vnode) : vnode;
}

export function notification(selector: string, properties?: any, children?: any) {

  let childrenNodes = children;
  let props = properties;
  if (!children) {
    childrenNodes = properties;
    props = {};
  }
  childrenNodes = !Array.isArray(childrenNodes) ? [childrenNodes] : childrenNodes;
  return div('.notification' + selector, props, [
    button('.delete'),
    ...childrenNodes,
  ]);
}

export function image(selector: string, properties: any) {

  return figure('.image' + (selector || ''), [
    img(properties),
  ]);
}

export function getValidClass(isValid?: boolean) {
  return isValid === true ? '.is-success' : (isValid === false ? '.is-danger' : '');
}

export {
  ISelectAttribute,
  IInputAttributeEx,
  ICheckboxAttirbute,
};
