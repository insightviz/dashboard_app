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
                <input {...register("firstName", { required: 'First name is required', pattern: {value: /[A-Za-z]+/, message: 'Invalid first name'}})} type="text" placeholder="First Name" />
                <p>{errors.firstName?.message}</p>
              </div>
              <div className="last-name-input">
                <label htmlFor="lastName">Last Name</label>
                <input {...register("lastName", { required: 'Last name is required', pattern: {value: /[A-Za-z]+/, message: 'Invalid last name'}})} type="text" placeholder="Last Name" />
                <p>{errors.lastName?.message}</p>
              </div>
            </div>
                
            <div className="email-input">
              <label htmlFor="email">Email</label>
              <input {...register("email", { required: 'Email is required'})} type="email" placeholder="you@example.com" />
              <p>{errors.lastName?.message}</p>
            </div>
            
            <div className="submit-button">
              <input type="submit" value="Sign Up" />
            </div>
          </form>
      </div>
    );
}

export default SignUpForm;