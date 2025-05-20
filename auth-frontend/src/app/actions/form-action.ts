"use server";

import axios from "axios";
import setCookieParser from "set-cookie-parser";
import { cookies } from "next/headers";
import { LoginFormSchema, SignupFormSchema } from "../lib/definitions";

export const LoginAction = async (prevState: unknown, formData: FormData) => {
  console.log(prevState);
  const validateField = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  console.log("fields validate");
  if (!validateField.success) {
    return { error: validateField.error.flatten().fieldErrors };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axios.post("/user/login", { email, password });
    const data = await res.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);
    cookieData.forEach((cookie) =>{
        //@ts-ignore
        cookieStore.set(cookie.name , cookie.value , {...cookie})
    })
    return data;
  } catch (error) {
    console.log("Error occured during login", error);
    throw error;
  }
};

export const SignupAction = async (prevState: unknown, formData: FormData) => {
  console.log(prevState);

  const validateField = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  console.log("fields validate");
  if (!validateField.success) {
    return { error: validateField.error.flatten().fieldErrors };
  }
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axios.post("/user/register", { name, email, password });
    const data = await res.data;
    const cookieStore = await cookies();
    const cookieData = setCookieParser(res.headers["set-cookie"]!);
    cookieData.forEach((cookie) =>{
        //@ts-ignore
        cookieStore.set(cookie.name , cookie.value , {...cookie})
    })
    return data;
  } catch (error) {
    console.log("Error occured during login", error);
    throw error;
  }
};
