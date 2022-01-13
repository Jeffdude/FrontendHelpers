import React, { useState } from 'react';
import { useGetDebug, useSetDebug } from './hooks/debug';
import { useLogin, useLogout, useCreateAccount } from './hooks/auth';
import { PageCard } from './components/common'

function App() {
  const debugState = useGetDebug();
  const login = useLogin();
  const logout = useLogout();
  const setDebug = useSetDebug();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const createAccount = useCreateAccount();
  const onSubmitCreateAccount = async (e) => {
    e.preventDefault();
    console.log({email, password})
    const result = await createAccount({email, password})
    console.log("result:", result);
  }
  const onSubmitSignIn = async (e) => {
    e.preventDefault();
    console.log({email, password})
    const result = await login({email, password})
    console.log("result:", result);
  }
  return (
    <PageCard>
      {debugState ? "true" : "false"}
      <button onClick={() => setDebug(!debugState)}>swap</button>
      <button onClick={() => login({email: "admin@admin.com", password: "pass"})}>
        log in admin
      </button>
      <button onClick={() => logout()}>
        log out
      </button>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
      <input type="text" value={password} onChange={e => setPassword(e.target.value)}/>
      <form onSubmit={onSubmitCreateAccount}>
        <button type="submit">Create Account</button>
      </form>
      <form onSubmit={onSubmitSignIn}>
        <button type="submit">Sign In</button>
      </form>
    </PageCard>
  );
}

export default App;
