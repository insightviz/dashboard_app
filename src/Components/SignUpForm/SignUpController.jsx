import SignUpForm from "../SignUpForm/SignUpForm";
import { useToast, Text  } from '@chakra-ui/react'

const SignUpController = () => {
  const toast = useToast()

  const onSubmit = (data) => {
  fetch("http://localhost:5000/signup", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
  .then(response => toast({
    title: response.title,
    description: response.message,
    status: response.status,
    duration: 9000,
    isClosable: true,
    })
  )
  }

  
  return (
      <SignUpForm onSubmit={onSubmit}/>
  )
}
export default SignUpController;