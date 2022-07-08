import { useState } from "react";
import { useForm } from "react-hook-form";

function SignUpForm ({handleSubmit}) {
    const { register, watch, formState: { errors } } = useForm();
        
      
    
  
    
    return (
      <div>
          <form onSubmit={handleSubmit}>
            <legend>Sign up to keep updated about new dashboards!</legend>
            <div className="name-inputs">
              <div className="first-name-input">
                <label htmlFor="firstName">First Name</label>
                <input {...register("firstName", { required: true})} type="text" placeholder="First Name" />
              </div>
              <div className="last-name-input">
                <label htmlFor="lastName">Last Name</label>
                <input {...register("lastName", { required: true})} type="text" placeholder="Last Name" />
              </div>
            </div>
                
            <div className="email-input">
              <label htmlFor="email">Email</label>
              <input {...register("email", { required: true})} type="email" placeholder="you@example.com" />
            </div>
            
            <div className="submit-button">
              <input type="submit" value="Sign Up" />
            </div>
          </form>
      </div>
    );
}

export default SignUpForm;