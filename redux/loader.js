import React from 'react';

import { useSelector } from 'react-redux';

import { OptionalCard } from '../components/common.js';
import { LoadingIcon } from '../components/loading.js';

/*
 * Are you tired of redux giving you uninitialized values from useSelector?
 * Switch to SelectorLoader today, and let us deal with shitty unwanted redux
 * values!
 *
 * -- Note: requested value must have 'initialState' as undefined in the store
 */
export function SelectorLoader({selectorFn, propName, pageCard, children, ...props}) {
  const data = useSelector(selectorFn);
  if (data === undefined) {
    return (
      <OptionalCard pageCard={pageCard}>
        <LoadingIcon size={45}/>
      </OptionalCard>
    )
  }
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {[propName]: data, ...props})
    }
    return child;
  });
}
