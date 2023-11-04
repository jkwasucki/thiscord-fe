import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    server:{
        serversTab:true,
    },
    friends:{
        convos:true,
        friendsTab:false,
    },
    globals:{
        chat:false,
        activity:false
    },
    prevTab:[

    ] as {group:string,component:string}[]
}

export const mobileSlice = createSlice({
    name: 'mobile',
    initialState,
    reducers: {
        setMobileState: (state,action) =>{
            // For defining previous tab
            if(state.prevTab.length === 2){
                state.prevTab.splice(0,1)
                state.prevTab.push(action.payload)
            }else{
                state.prevTab.push(action.payload)
            }

            if(action.payload.group === 'server'){
                if(action.payload.component === 'serversTab'){
                    state.server.serversTab = true
                    state.globals.chat = false
                    state.globals.activity = false
                }
            }else if(action.payload.group === 'friends'){
                if(action.payload.component === 'convos'){
                    state.friends.convos = true
                    state.friends.friendsTab = false
                    state.globals.chat = false
                    state.globals.activity = false
                }else if(action.payload.component === 'friendsTab'){
                    state.friends.friendsTab = true
                    state.friends.convos = false
                    state.globals.chat = false
                    state.globals.activity = false
                }
            }else if(action.payload.group === 'globals'){
                if(action.payload.component === 'chat'){
                    state.globals.chat = true
                    state.friends.convos = false
                    state.friends.friendsTab = false
                    state.server.serversTab = false
                    state.globals.activity = false
                }else if(action.payload.component === 'activity'){
                    state.globals.activity = true
                    state.friends.convos = false
                    state.friends.friendsTab = false
                    state.server.serversTab = false
                    state.globals.chat = false
                }
            }
           
        },
        clearMobileState: (state, action) => {
            state.server.serversTab = initialState.server.serversTab;
            state.globals.chat = initialState.globals.chat;
            state.globals.activity = initialState.globals.activity;
            state.friends.convos = initialState.friends.convos;
            state.friends.friendsTab = initialState.friends.friendsTab;
            
          },
    }
  })
  
  export const {setMobileState,clearMobileState} = mobileSlice.actions
  
  export default mobileSlice.reducer