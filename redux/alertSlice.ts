import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    alert:{
        type:"",
        text:"",
        status:'off'
    }
   
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        createAlert: (state,action) =>{
          const {type,text} = action.payload
          state.alert = {type,text,status:'on'}
          
        },
        clearAlert: (state,action) =>{
            state.alert = {
                type:"",
                text:"",
                status:"off"
            }
        }
    }
  })
  
  export const {createAlert,clearAlert} = alertSlice.actions
  
  export default alertSlice.reducer