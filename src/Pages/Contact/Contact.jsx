import { useEffect } from "react";
import ReactGA from "react-ga4";

function Contact() {
    
    useEffect(() => {
      ReactGA.send("pageview");
    }, [])
    return (
        <h1>This is the contact page</h1>
    );
}

export default Contact;