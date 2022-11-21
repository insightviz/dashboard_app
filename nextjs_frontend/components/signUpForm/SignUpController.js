import SignUpForm from "./SignUpForm";
import { useForm } from '@mantine/form';
import { useState } from "react";
import { showNotification } from '@mantine/notifications';
import { Smile, Meh } from '@geist-ui/icons'

const SignUpController = () => {
  const [isSubmittingFormData, setIsSubmittingData] = useState(false)
  const form = useForm({
    initialValues: {
      firstName: '',
      email: '',
    },
    
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const onSubmit = (data) => {
    setIsSubmittingData(true)
    form.reset()
    fetch("/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
    .then(response => {
      showNotification({
            radius: 'xl',
            title: response.title,
            message: response.message,
            autoClose: 5000,
            icon: response.status == 'success' ? <Smile size={20}/> : <Meh size={20}/>,
            color: response.status == 'success' ? 'teal' : 'red',
          })
      setIsSubmittingData(false)
    })
  }
  
  return (
      <SignUpForm onSubmit={onSubmit} form={form} isSubmittingFormData={isSubmittingFormData}/>
  )
}
export default SignUpController;