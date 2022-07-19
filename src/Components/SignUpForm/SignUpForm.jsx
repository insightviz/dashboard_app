import { useForm } from "react-hook-form";
import './SignUpForm.css'

function SignUpForm ({onSubmit}) {
    const { register, handleSubmit } = useForm();
    return (
      <section className="signup-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-title">
            <h3>Subscribe for updates on new dashboards!</h3>
          </div>
          <div className="inputs">
            <div className="first-name-input">
              <input {...register("firstName")} type="text" placeholder="First Name" />
            </div>
            <div className="email-input">
              <div>
                <input {...register("email", { required: 'Email is required'})} type="email" placeholder="Email Address" />
              </div>
            </div>
          </div>           
          <div className="submit-button">
            <input type="submit" value="Subscribe" />
          </div>
        </form>
      </section>
    );
}

export default SignUpForm;