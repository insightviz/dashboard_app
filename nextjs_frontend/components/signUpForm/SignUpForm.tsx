import styles from './SignUpForm.module.css'
import Mail from '@geist-ui/icons/mail'
import { TextInput, ActionIcon } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useElementSize } from '@mantine/hooks';
import ChevronRight from "../../assets/svgs/chevronRight.svg";
import Envelope from "../../assets/svgs/envelope.svg";

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
          icon={<Envelope className={styles.envelope}/>}
          radius="xl"
          size="xl"
          weight={400}
          color='supportCoolGrey.9' 
          label='Subscribe for dashboard updates'
          rightSection={
            <ActionIcon 
              size={32} 
              radius="xl"  
              variant="filled" 
              loading={isSubmittingFormData} 
              ref={ref} 
              color='primaryBlue'
              type="submit">
              <ChevronRight className={styles.chevronRight}/>
            </ActionIcon>
          }
          placeholder="Enter email"
          aria-label='Email input'
          {...form.getInputProps('email')}
          rightSectionWidth={60}
          iconWidth={60}
        />
      </form>
    </section>
  );
}