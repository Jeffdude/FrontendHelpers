import React, { useContext, useState } from 'react';
import { useGetDebug, useSetDebug } from './hooks/debug';
import { useLogin, useLogout, useCreateAccount, useGetSelf, useGetAuthState, usePatchUser } from './hooks/auth';
import { QueryLoader } from './data';

const userInfoContext = React.createContext()

const PatchUserTest = ({userInfo}) => {
  return <userInfoContext.Provider value={userInfo}>
    <PatchUserConsumer/>
  </userInfoContext.Provider>
}

const PatchUserConsumer = () => {
  const userInfo = useContext(userInfoContext);
  const [firstName, setFirstName] = useState(userInfo.firstName ? userInfo.firstName : '')
  const patchUser = usePatchUser();
  const onSubmitPatchUser = () => patchUser({ firstName });
  return (
    <div style={{marginTop: "20px", border: "2px solid black"}}>
      - Patch user test - <br/>Username: {userInfo.firstName}
      <form onSubmit={onSubmitPatchUser}>
        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder='name'/>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

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
  const userInfoQuery = useGetSelf();
  const authState = useGetAuthState();
  return (
    <div style={{
      padding: "10px", display: "flex", flexDirection: "column", width: "200px", alignItems: "flex-start"
    }}>
      {debugState ? "true" : "false"}
      <button onClick={() => setDebug(!debugState)}>swap</button>
      <button onClick={() => login({email: "admin@admin.com", password: "pass"})}>
        log in admin
      </button>
      <button onClick={() => logout()}>
        log out
      </button>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder='email'/>
      <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder='password'/>
      <form onSubmit={onSubmitCreateAccount}>
        <button type="submit">Create Account</button>
      </form>
      <form onSubmit={onSubmitSignIn}>
        <button type="submit">Sign In</button>
      </form>
      {authState && <QueryLoader query={userInfoQuery} propName="userInfo"><PatchUserTest/></QueryLoader>}
    </div>
  );
}

export default App;
