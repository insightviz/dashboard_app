import SignUpForm from "../signUpForm/SignUpForm";
import { useToasts, Text } from '@geist-ui/core'

const SignUpController = () => {
  const { setToast } = useToasts()
  const action = {
    name: 'cancel',
    passive: true,
    handler: (event, cancel) => cancel()
  }
  const onSubmit = (data) => {
  fetch("/signup", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
  .then(response => setToast({
    text: <Text font="1.4rem">{response.message}</Text>,
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