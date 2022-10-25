import { useForm } from "react-hook-form";
import styles from './SignUpForm.module.css'
import { User, AtSign } from '@geist-ui/icons'
import { Button } from '@geist-ui/core'
import { UserCheck } from '@geist-ui/icons'

function SignUpForm ({onSubmit}) {
    const { register, handleSubmit } = useForm();
    return (
      <section className={styles.signupForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formTitle}>
            <h2>Subscribe for updates on new dashboards!</h2>
          </div>
          <div className={styles.inputs}>
            <div className={styles.firstNameContainer}>
              <div className={styles.firstNameIcon}>
                <User size="2rem"/>
              </div>
              <input className={styles.firstNameInput} 
                {...register("firstName")} type="text" 
                placeholder="First Name" />
            </div>
            <div className={styles.emailContainer}>
              <div className={styles.emailIcon}>
                <AtSign size="2rem"/>
              </div>
              <input className={styles.emailInput} 
                {...register("email", { required: 'Email is required'})} 
                type="email" placeholder="Email Address" />
            </div>
            <Button
              iconRight={<UserCheck />} auto onClick={handleSubmit(onSubmit)}>
                Subscribe
            </Button>
          </div>
        </form>
      </section>
    );
}

export default SignUpForm;