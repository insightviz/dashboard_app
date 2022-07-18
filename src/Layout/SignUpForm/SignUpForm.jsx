import { useForm } from "react-hook-form";
import './SignUpForm.css'

function SignUpForm ({onSubmit}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
   
    
    return (
      <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-title">
                <h3>Subscribe for updates on new dashboards!</h3>
            </div>
            <div className="inputs">
              <div className="first-name-input">
                <label htmlFor="firstName">Your first name</label>
                <input {...register("firstName", { required: 'First name is required', pattern: {value: /[A-Za-z]+/, message: 'Invalid first name'}})} type="text" placeholder="First Name" />
              </div>
              <div className="last-name-input">
                <label htmlFor="lastName">Your last name</label>
                <input {...register("lastName", { required: 'Last name is required', pattern: {value: /[A-Za-z]+/, message: 'Invalid last name'}})} type="text" placeholder="Last Name" />
              </div>
              <div className="email-input">
                <div>
                  <label htmlFor="email">Your email address</label>
                  <input {...register("email", { required: 'Email is required'})} type="email" placeholder="you@example.com" />
                </div>
              </div>
            </div>
                           
            <div className="submit-button">
              <input type="submit" value="Subscribe" />
            </div>
          </form>
      </div>
    );
}

export default SignUpForm;