import { LoginAction } from "@/app/actions/form-action"
import Authform from "../Authform"

const Login = () => {
  return (
    <div>
        <Authform isSignup ={false} action= {LoginAction}/>
    </div>
  )
}

export default Login