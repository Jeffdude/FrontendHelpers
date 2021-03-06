import React, { useContext, useState } from 'react';
import { useGetDebug, useSetDebug } from './hooks/debug';
import { useLogin, useLogout, useCreateAccount, useGetSelf, useGetAuthState, usePatchUser, usePasswordResetWithToken, useRefresh } from './hooks/auth';
import { useGetUserInfo } from './hooks/user';
import { QueryLoader } from './data';
import { JFHContext } from './context';

const PatchUserTest = ({userInfo}) => {
  const [firstName, setFirstName] = useState(userInfo.firstName ? userInfo.firstName : '')
  const patchUser = usePatchUser();
  const onSubmitPatchUser = (e) => {
    e.preventDefault();
    patchUser({ firstName });
  }
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

const QueryLoaderTest = ({user}) => {
  return (
    <div style={{marginTop: "20px", border: "2px solid black"}}>
      - QueryLoader test -<br/>
      {JSON.stringify(user)}
    </div>
  )
}

const PWResetTest = () => {
  const [token, settoken] = useState('');
  return (
    <div style={{marginTop: "20px", border: "2px solid black"}}>
      - PW Reset Test - <br/>
      <input type="text" value={token} onChange={e => settoken(e.target.value)} placeholder='key'/>
      {token && <PWResetTestWithKey token={token}/>}
    </div>
  )
}

const PWResetTestWithKey = ({token}) => {

  const [password, setPassword] = useState('')
  const resetPasswordWithToken = usePasswordResetWithToken(token);
  const onSubmit = (e) => {
    e.preventDefault();
    resetPasswordWithToken({password});
  }

  return (
    <div style={{marginTop: "20px"}}>
      <form onSubmit={onSubmit}>
        <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder='new password'/>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

const RefreshTokenTest = () => {
  const [{refresh_token},] = useContext(JFHContext);
  const refreshToken = useRefresh();

  return (
    <div style={{marginTop: "20px", border: "2px solid black"}}>
      - Refresh Token Test - <br/>
      <button onClick={() => refreshToken({refresh_token})}>refresh</button>
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
  const authState = useGetAuthState();
  const userInfo = useGetUserInfo()
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
      {authState && <PatchUserTest userInfo={userInfo}/>}
      {authState && <QueryLoader query={useGetSelf} propName="user" generateQuery><QueryLoaderTest/></QueryLoader>}
      {!authState && <PWResetTest/>}
      {authState && <RefreshTokenTest/>}
    </div>
  );
}

export default App;
