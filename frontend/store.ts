import { configureStore } from '@reduxjs/toolkit'
import { publicationsAPI } from './rtk/lenspub.api'

export const store = configureStore({
  reducer: {
    [publicationsAPI.reducerPath]: publicationsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(publicationsAPI.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch