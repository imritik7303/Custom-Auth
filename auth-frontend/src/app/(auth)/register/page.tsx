import { SignupAction } from "@/app/actions/form-action"
import Authform from "../Authform"


const Signup = () => {
  return (
    <div>
        <Authform isSignup={true} action={SignupAction}/>
    </div>
  )
}

export default Signup
