import 'jest';
import React from 'react';
import { render, act } from '@testing-library/react';

import '@testing-library/jest-dom'

import { useLogin } from '../hooks/auth';
import { useSetDebug } from '../hooks/debug';
import { TestJFHApp, makeActionButton, makeTestUtils } from './utils';


describe('Testing Reducer', () => {
  it('Can render', () => {
    const { expectKeysToEqual } = makeTestUtils(render(<TestJFHApp/>));
    expectKeysToEqual({debug: false});
  });
  it('Can set debug', () => {
    const TestElement = () => {
      const setDebug = useSetDebug();
      return makeActionButton(() => setDebug(true))
    }
    const { getByTestId } = render(<TestJFHApp><TestElement/></TestJFHApp>);
    const utils = makeTestUtils({getByTestId});
    utils.expectKeysToEqual({debug: false})
    act(() => utils.clickButton());
    utils.expectKeysToEqual({debug: true});
  });
  it('Can login', () => {
    const TestElement = () => {
      const login = useLogin();
      return makeActionButton(() => login({email: "admin@admin.com", password: "pass"}))
    }
    const utils = makeTestUtils(render(<TestJFHApp><TestElement/></TestJFHApp>))
    utils.expectKeysToBeNull(['auth_state', 'access_token', 'refresh_token', 'expires_at', 'user_id']);
    utils.logKeys(['auth_state', 'access_token', 'refresh_token', 'expires_at', 'user_id'], 'before')
    act(() => utils.clickButton());
    utils.logKeys(['auth_state', 'access_token', 'refresh_token', 'expires_at', 'user_id'], 'after')
    utils.expectKeysToExist(['auth_state', 'access_token', 'refresh_token', 'expires_at', 'user_id'])
    utils.expectKeysToEqual({auth_state: 500})
  });
})