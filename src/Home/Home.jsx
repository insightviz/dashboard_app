import React from 'react';
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
        <div>
            <h1>This is the homepage</h1>
        </div>
        <div>
            <ul>
                <li><Link to="/stopsearch">Stop and search dashboard</Link></li>
            </ul>
        </div>
        </div>
    );
}

export default Home;