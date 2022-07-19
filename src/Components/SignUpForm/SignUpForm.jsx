import { useForm } from "react-hook-form";
import './SignUpForm.css'
import { MdAlternateEmail, MdPersonOutline } from "react-icons/md";

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
                <MdPersonOutline size="2rem"/>
              </div>
              <input className="first-name-input" {...register("firstName")} type="text" placeholder="First Name" />
            </div>
            <div className="email-container">
              <div className="email-icon">
                <MdAlternateEmail size="2rem"/>
              </div>
              <input className="email-input" {...register("email", { required: 'Email is required'})} type="email" placeholder="Email Address" />
            </div>
            <div className="submit-button">
              <input type="submit" value="Subscribe" />
            </div>
          </div>
        </form>
      </section>
    );
}

export default SignUpForm;