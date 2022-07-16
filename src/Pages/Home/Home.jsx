import { Link } from "react-router-dom";
import "./Home.css"

function Home() {
    return (
        <div className="home">
          <div className="title">
            <h1>
              <span className="one">INSIGHT</span>
              <span className="two">IN A DATA</span>
              <span className="three">FILLED WORLD</span>
            </h1>
          </div>
          <div className="dashboards">
            <h2>Lastest Dashboards</h2>
            <ul>
              <li><Link to="/stopsearch">Stop and search</Link></li>
            </ul>
          </div>
        </div>
    );
}

export default Home;