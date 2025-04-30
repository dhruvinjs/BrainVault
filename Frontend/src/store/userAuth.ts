import { api } from '../api/axios'
import {create} from 'zustand'

export interface  userCreds{
    username:string,
    password:string
}


export interface UserAuth{
    user:userCreds | null,
    loading : boolean,
    error: string | null,
    signup: (formData: userCreds) => Promise<boolean>;
    login: (formData: userCreds) => Promise<boolean>;
    logout: () => Promise<boolean>;
    checkAuth: () => Promise<void>;
    editProfile:(formData:any)=>Promise<boolean>
}

export const userAuth = create<UserAuth>((set,get)=>({
    user:null,
    loading : false,
    error: null,

    signup : async(formData:userCreds) => {
       set({loading:true,error:null})
        try {
            const res = await api.post("/signup",formData)
            set({loading:false})
            return true
        } catch (err:any) {
            console.log("error while signup",err)
            set({ error: err.response?.data?.message || 'Signup failed',loading:false })
            return false
        }
    },

    login : async(formData) => {
        set({loading:true,error:null})
        try {
            const res = await api.post("/login",formData)
            set({user : res.data.user,loading:false})
            return true
        } catch (err:any) {
            console.log("error while login",err)
            const errMsg = err?.response?.data?.error 
            set({ error: errMsg || 'Signup failed' ,loading:false})
            return false 
            }
    },

    logout : async() => {
        try {
            const res = await api.post("/logout")
            set({user : null})
            return true
        } catch (err:any) {
            console.log("error while logout",err)
            const errMsg = err?.response?.data?.error
            set({ error: errMsg || 'Signup failed' ,loading:false})
            return false
        }
    },


    checkAuth : async() => {
        try {
            const res = await api.get("/user/checkAuth")
            set({user : res?.data?.user})
        } catch (err:any) {
            console.log("error while checkauth",err)
            const errMsg=err.response?.data?.message
            set({ error: errMsg || 'Signup failed',loading:false })
        }
    },

    editProfile:async (data:any) => {
        set({loading:true})
        try {
            const res=await api.patch('/profile/edit',data)
            set({user:res.data.user,loading:false})
            return true
        } catch (error:any) {
            console.log(error)
            set({loading:false,error:error.response.data.error.message})
            return false
        }
    }
}))