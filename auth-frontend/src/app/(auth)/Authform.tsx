"use client"
import { log } from 'console'
import React, { useActionState } from 'react'

const inputstyle = "px-2 py-2 bg-gray-600 rounded-lg"
type props = {
    isSignup : boolean,
    action : (prevstate:unknown , f: FormData) => Promise<any>
    //error with promise<void>
}
const Authform = ({isSignup , action} : props) => {
   
    const [state,formaAction ] = useActionState( action , undefined);
    
   return (
     <section className='w-full h-screen flex flex-col'>
        <form action = {formaAction}className='flex flex-col m-auto justify-center item-centre border-4 rounded-b-lg p-2 gap-3 '>
        
           state: {JSON.stringify(state)}

          <h4 className='text-4xl'>{isSignup ? "Registetr" : "Login"} from here</h4>

          {
           isSignup && (
            <>
            <label htmlFor="name">Name</label>
            <input type="text" id='name' name='name' className={inputstyle} />
            </>)
            }
          
          <label htmlFor="email">Email</label>
          <input type="email" id='email' name='email' className={inputstyle} />

          <label htmlFor="password">Password</label>
          <input type="password" id='password' name='password' className={inputstyle} />

          <button className='bg-slate-300 text-indigo-900 rounded-lg px-4 py-1'>{isSignup ? "Register" :"Login"}</button>

        </form>
     </section>

  )
}

export default Authform