export default {
  ...require('./redux/loader'), // SelectorLoader
  ...require('./data'), // QueryLoader, useGetQuery, createMutationCall
  ...require('./hooks/auth'), // useCreateAccount, useLogin, etc...
  redux: {
    ...require('./redux/store'), // makeStore
    ...require('./redux/authSlice'), // all auth info
  },
  components: {
    ...require('./components/buttons'),
    ...require('./components/common'),
    ...require('./components/lists'),
    ...require('./components/loading'),
  },
  testFn: () => console.log('test'),
}