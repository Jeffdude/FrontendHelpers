import React from 'react';
import { useGetDebug, useSetDebug } from './hooks/debug';
import { useLogin, useLogout } from './hooks/auth';
import { PageCard } from './components/common'

function App() {
  const debugState = useGetDebug();
  const login = useLogin();
  const logout = useLogout();
  const setDebug = useSetDebug();
  return (
    <PageCard>
      {debugState ? "true" : "false"}
      <button onClick={() => setDebug(!debugState)}>swap</button>
      <button onClick={() => login({email: "admin@admin.com", password: "pass"})}>
        log in
      </button>
      <button onClick={() => logout()}>
        log out
      </button>
    </PageCard>
  );
}

export default App;
