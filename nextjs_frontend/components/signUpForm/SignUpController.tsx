import SignUpForm from "./SignUpForm";
import { useForm } from '@mantine/form';
import { useState } from "react";
import { showNotification } from '@mantine/notifications';
import Smile from '@geist-ui/icons/smile'
import Meh from '@geist-ui/icons/meh'

const ReactGA = ( await import('react-ga4')).default

interface FormValues {
  firstName: string;
  email: string;
}

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

  const onSubmit = (data: FormValues) => {
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
            icon: response.status == 'success' ? <Smile size={20} color='#004440'/> : <Meh size={20} color='#610404'/>,
            color: response.status == 'success' ? 'supportGreen.3' : 'supportRed.3',
          })
      setIsSubmittingData(false)
    })
    ReactGA.event({
      category: "signup",
      action: "signup",
    });
  }
  
  return (
      <SignUpForm onSubmit={onSubmit} form={form} isSubmittingFormData={isSubmittingFormData}/>
  )
}
export default SignUpController;