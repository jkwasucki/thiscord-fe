import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:{
        _id: '',
        email: '',
        password: '',
        nickname: '',
        avatar: '',
        tag: 0,
        friends: [] as User[],
        servers: [],
        notifications: []
    } as unknown as User
   
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        createSession:(state,action)=>{
            state.user = action.payload
        },
        removeSession:(state)=>{
            state.user = initialState.user
        }
    }
  })

  export const {createSession,removeSession} = userSlice.actions
  
  
  export default userSlice.reducer