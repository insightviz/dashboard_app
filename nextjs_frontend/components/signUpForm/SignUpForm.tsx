import styles from './SignUpForm.module.css'
import User from '@geist-ui/icons/user'
import AtSign from '@geist-ui/icons/atSign'
import UserCheck from '@geist-ui/icons/userCheck'
import { TextInput, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface FormValues {
  firstName: string;
  email: string;
}


interface SignUpFormProps {
  onSubmit: (data: FormValues) => void, 
  form: UseFormReturnType<FormValues>, 
  isSubmittingFormData: boolean
}

export default function SignUpForm({onSubmit, form, isSubmittingFormData}: SignUpFormProps) {
  return (
    <section className={styles.signupForm}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <div className={styles.formTitle}>
          <h2>Subscribe for updates on new dashboards!</h2>
        </div>
        <div className={styles.inputs}>
          <TextInput
            className={styles.firstNameContainer}
            icon={<User size={20}/>}
            aria-label='First name input'
            label="First Name"
            placeholder="First Name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            className={styles.emailContainer}
            icon={<AtSign size={20}/>}
            aria-label='Email input'
            withAsterisk
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />
        </div>
        <Button 
          rightIcon={<UserCheck size={20} />} 
          type="submit" 
          variant="default" 
          loading={isSubmittingFormData}>
            Subscribe
        </Button>
      </form>
    </section>
  );
}