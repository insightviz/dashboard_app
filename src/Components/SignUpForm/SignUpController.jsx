import SignUpForm from "../SignUpForm/SignUpForm";
import { useToasts } from '@geist-ui/core'

const SignUpController = () => {
  const { setToast } = useToasts()
  const action = {
    name: 'cancel',
    passive: true,
    handler: (event, cancel) => cancel()
  }
  const onSubmit = (data) => {
  fetch("http://localhost:5000/signup", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
  .then(response => setToast({
    text: response.message,
    type: response.status,
    delay: 5000,
    actions: [action],
    })
  )
  }

  
  return (
      <SignUpForm onSubmit={onSubmit}/>
  )
}
export default SignUpController;