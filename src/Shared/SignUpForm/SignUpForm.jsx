import { useState } from "react";

function SignUpForm () {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
        
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
      e.preventDefault();
      setSubmitting(true);

      setTimeout(() => {
        setSubmitting(false);
      }, 1500)
 
    }
  
    
    return (
      <div>
          {isSubmitting &&
              <div>Submtting Form...</div>
            }
          <form onSubmit={handleSubmit}>
            <legend>Sign up to keep updated about new dashboards!</legend>
            <div className="name-inputs">
              <div className="first-name-input">
                <label htmlFor="firstName">First Name</label>
                <input type="text" value={firstName} onChange={handleFirstNameChange} id="firstName" name="first_name" placeholder="First Name" required />
              </div>
              <div className="last-name-input">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" value={lastName} onChange={handleLastNameChange} id="lastName" name="last_name" placeholder="Last Name" required/>
              </div>
            </div>
                
            <div className="email-input">
              <label htmlFor="email">Email</label>
              <input type="email" value={email} onChange={handleEmailChange} id="email" name="email" placeholder="you@example.com" required/>
            </div>
            
            <div className="submit-button">
              <input type="submit" value="Sign Up" />
            </div>
          </form>
      </div>
    );
}

export default SignUpForm;