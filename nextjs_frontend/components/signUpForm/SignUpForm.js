import styles from './SignUpForm.module.css'
import { User, AtSign, UserCheck } from '@geist-ui/icons'
import { TextInput, Button } from '@mantine/core';

export default function SignUpForm({onSubmit, form, isSubmittingFormData}) {
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