import Navbar from "./Navbar";
import { useState } from 'react';

const NavbarController = ()  => {
    // model
    const [click, setClick] = useState(false);
    
    //controller
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    return (
        <Navbar click={click} handleClick={handleClick} closeMobileMenu={closeMobileMenu}/>
    )
}

export default NavbarController;