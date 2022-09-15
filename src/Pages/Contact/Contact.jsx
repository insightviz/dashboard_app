import { useEffect } from "react";
import ReactGA from "react-ga4";

function Contact() {
    
    useEffect(() => {
      ReactGA.initialize("G-V4MJ3V3C21");
      ReactGA.send("pageview");
    }, [])
    return (
        <h1>This is the contact page</h1>
    );
}

export default Contact;