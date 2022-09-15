import { useForm } from "react-hook-form";
import './SignUpForm.css'
import { User, AtSign } from '@geist-ui/icons'
import { Button } from '@geist-ui/core'
import { UserCheck } from '@geist-ui/icons'

function SignUpForm ({onSubmit}) {
    const { register, handleSubmit } = useForm();
    return (
      <section className="signup-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-title">
            <h3>Subscribe for updates on new dashboards!</h3>
          </div>
          <div className="inputs">
            <div className="first-name-container">
              <div className="first-name-icon">
                <User size="2rem"/>
              </div>
              <input className="first-name-input" 
                {...register("firstName")} type="text" 
                placeholder="First Name" />
            </div>
            <div className="email-container">
              <div className="email-icon">
                <AtSign size="2rem"/>
              </div>
              <input className="email-input" 
                {...register("email", { required: 'Email is required'})} 
                type="email" placeholder="Email Address" />
            </div>
            <div className="submit-button">
              <Button
                iconRight={<UserCheck />} auto onClick={handleSubmit(onSubmit)}>
                  Subscribe
              </Button>
            </div>
          </div>
        </form>
      </section>
    );
}

export default SignUpForm;