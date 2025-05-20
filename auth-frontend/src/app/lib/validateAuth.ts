import axios from "axios";

import { cookies } from "next/headers";

export const validateAuth = async () => {
  console.log("validating the user");
  try {
    const cookieStore = await cookies();
    const URL = process.env.LOCAL_BACKEND_URL + "/validate/tokens";
    const res = await axios.put(
        URL,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `access_token=${
              cookieStore.get("access_token")?.value
            } ,refresh_token=${cookieStore.get("refresh_token")?.value}`,
          },
        }
      );
    const data = await res.data;
    console.log("response from the validate", data);
    return data;
  } catch (error) {
    console.log("Error while validating", error);
    throw error;
  }
};
