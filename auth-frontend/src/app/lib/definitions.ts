import {z} from "zod"
const SignupFormSchema = z.object({
    name : z
    .string()
    .min(4,{message:"name mustbbe atleat 4 characters long"})
    .trim(),
    email : z
    .string()
    .email({message:"please enter valid email"}),
    password : z
    .string()
    .min(6,{message:"password should be atleat 6  character long"})
    .trim()
})

const LoginFormSchema = z.object({
    email : z
    .string()
    .email({message:"please enter valid email"}),
    password : z
    .string()
    .min(6,{message:"password should be atleat 6  character long"})
    .trim()
})

export {SignupFormSchema , LoginFormSchema}