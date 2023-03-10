import styles from './SignUpForm.module.css'
import AtSign from '@geist-ui/icons/atSign'
import UserCheck from '@geist-ui/icons/userCheck'
import { TextInput, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useElementSize } from '@mantine/hooks';

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
  const { ref, width } = useElementSize();
  console.log(width)
  return (
    <section className={styles.signupForm}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          className={styles.emailContainer}
          icon={<AtSign size={20}/>}
          radius="xl"
          size="lg"
          weight={400}
          label='Dashboard updates'
          rightSection={
            <Button 
              ref={ref}
              rightIcon={<UserCheck size={16} />} 
              type="submit" 
              variant="default" 
              size='md'
              loading={isSubmittingFormData}>
                Subscribe
            </Button>
          }
          placeholder="Enter email"
          aria-label='Email input'
          {...form.getInputProps('email')}
          rightSectionWidth={width+45.2}
        />
      </form>
    </section>
  );
}