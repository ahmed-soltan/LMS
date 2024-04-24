import {create} from 'zustand'

type ConfettiStore={
    isOpen:boolean
    setOpen:()=>void,
    setClose:()=>void,
}

export const useConfettiStore=create<ConfettiStore>(set=>({
    isOpen:false,
    setOpen:()=>set({isOpen:true}),
    setClose:()=>set({isOpen:false}),
}))