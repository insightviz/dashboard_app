import SignUpForm from "../SignUpForm/SignUpForm";

const SignUpController = () => {

    const onSubmit = (data) => {
    fetch("http://localhost:5000/signup", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.text())
    .then(string => alert(string))
   }

   return (
       <SignUpForm onSubmit={onSubmit}/>      
   )
}
export default SignUpController;