import { useState } from "react";

function SignUpForm () {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
        
    const handleFirstNameChange = (e) => {
      setFirstName(e.target.value);
    }
    
    const handleLastNameChange = (e) => {
      setLastName(e.target.value);
    }

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    }
  
    const handleSubmit = (e) => {
      alert('A name was submitted: ' + firstName);
      e.preventDefault();
    }
  
    
    return (
      <form onSubmit={handleSubmit}>
        <fieldset>
            <legend>Sign up to keep updated about new dashboards!</legend>
            <label htmlFor="firstName">
              First Name:
              <input type="text" value={firstName} onChange={handleFirstNameChange} id="firstName" name="first_name" placeholder="First Name" required />
            </label>
            <label htmlFor="lastName">
              Last Name:
              <input type="text" value={lastName} onChange={handleLastNameChange} id="lastName" name="last_name" placeholder="Last Name" required/>
            </label>
            <label htmlFor="email">
              Email:
              <input type="email" value={email} onChange={handleEmailChange} id="email" name="email" placeholder="you@example.com" required/>
            </label>
            <input type="submit" value="Sign Up" />
        </fieldset>
      </form>
    );
}

export default SignUpForm;