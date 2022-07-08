import { useState } from "react";
import { useForm } from "react-hook-form";

function SignUpForm ({onSubmit}) {
    const { register, handleSubmit, formState: { errors } } = useForm();
        
      
    
  
    
    return (
      <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <legend>Sign up to keep updated about new dashboards!</legend>
            <div className="name-inputs">
              <div className="first-name-input">
                <label htmlFor="firstName">First Name</label>
                <input {...register("firstName", { required: 'First name is required'})} type="text" placeholder="First Name" />
                {errors.firstName && <p>First name is required.</p>}
              </div>
              <div className="last-name-input">
                <label htmlFor="lastName">Last Name</label>
                <input {...register("lastName", { required: 'Last name is required'})} type="text" placeholder="Last Name" />
                {errors.lastName && <p>Last name is required.</p>}
              </div>
            </div>
                
            <div className="email-input">
              <label htmlFor="email">Email</label>
              <input {...register("email", { required: 'Email is required'})} type="email" placeholder="you@example.com" />
              {errors.email && <p>Email is required.</p>}
            </div>
            
            <div className="submit-button">
              <input type="submit" value="Sign Up" />
            </div>
          </form>
      </div>
    );
}

export default SignUpForm;