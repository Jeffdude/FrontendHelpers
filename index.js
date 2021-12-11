exports = {
  ...require('./redux/loader'), // SelectorLoader
  ...require('./data'), // QueryLoader, useGetQuery, createMutationCall
  redux: {
    ...require('./redux/store'), // makeStore
    ...require('./redux/authSlice'), // all auth info
  } ,
}