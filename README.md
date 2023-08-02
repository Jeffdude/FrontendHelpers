# FrontendHelpers
Authentication state handling & various other frontend helpers I share between my projects.

Authentication + Querying functionality for [my bespoke backend framework here.](https://github.com/JMKRIDE-USA/Backend)

## Getting Started
```bash
npm install --save @jeffdude/frontend-helpers
# or
yarn install @jeffdude/frontend-helpers
```

## Authentication State Handling
A HOC provides all auth state data.
index.js:
```javascript
import { JFHApp } from '@jeffdude/frontend-helpers'

ReactDOM.render(
  <React.StrictMode>
    <JFHApp config={{backendURL: "http://192.168.0.88:3600"}}>
      <App />
    </JFHApp>
  </React.StrictMode>,
  document.getElementById('root')
);
```

Log In:
```javascript
import { useLogin } from '@jeffdude/frontend-helpers'

function MyComponent() {
  const login = useLogin()
  return (
    <form onSubmit={() => login({email, password})}>
      ...
    </form>
  )
}
```

Authenticated Backend Query: 
```javascript 
import { useGetQuery } from '@jeffdude/frontend-helpers'

const myQuery = useGetQuery(endpoint, key, { version = "v1", ...options });
```

Authenticated Backend Mutation:
```javascript
import { useCreateMutation } from '@jeffdude/frontend-helpers'

function useMyMutation(){
  return useCreateMutation(
    {endpoint, method, headers = {}, verb, body = true, options, createMutationCallOptions}
  )
}
```

## Using The Debug Site

1. In `package.json`, rename the "homepage" property to something else like "nothomepage".
2. In `src/index.js`, uncomment the ReactDom.render() codeblock and the imports it uses.
  - Here you can configure the `backendURL`.
3. Make sure your backend is running, and run `npm start`