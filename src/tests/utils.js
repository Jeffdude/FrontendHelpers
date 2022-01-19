import React, { useContext } from 'react';

import { act, fireEvent } from '@testing-library/react'
import JFHApp, { JFHContext } from '../context';

export const makeActionButton = (actionFn, {name} = {}) => (
  <button data-testid={name ? name : "button"} onClick={actionFn}/>
)

export const makeTestUtils = ({ getByTestId }) => {
  return {
    expectKeysToEqual: (expectations) => {
      for(const [key, value] of Object.entries(expectations)){
        expect(getByTestId(key)).toHaveTextContent(JSON.stringify(value));
      }
    },
    expectKeysToExist: (keys) => {
      for (const key of keys) {
        expect(getByTestId(key)).not.toBeNull;
      }
    },
    expectKeysToBeNull: (keys) => {
      for (const key of keys) {
        expect(getByTestId(key)).toBeNull;
      }
    },
    clickButton: ({name} = {}) => {
      act(() => {fireEvent(getByTestId(name ? name : 'button'), new MouseEvent('click', {bubbles: true}))});
    },
    logKeys: (keys, blurb) => {
      const log = {};
      for (const key of keys) {
        log[key] = getByTestId(key).textContent.length ? JSON.parse(getByTestId(key).textContent) : '';
      }
      console.log("[-] " + (blurb ? blurb : "logKeys") + ":", log)
    }
  }
}

const VerboseConsumer = () => {
  const [value,] = useContext(JFHContext);
  return (
    <div>
      {Object.entries(value).map(([key, value]) => <p data-testid={key} key={key + ": " + JSON.stringify(value)}>{JSON.stringify(value)}</p>)}
    </div>
  )
}

export const TestJFHApp = ({children}) => (
  <JFHApp config={{afterwareDisabled: true, debug: false}}>
    <div>{children}</div>
    <VerboseConsumer/>
  </JFHApp>
);