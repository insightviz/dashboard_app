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
            <div className="dashboard-content">
              <div className="stop-search">
                <h3>Stop and search</h3>
                <p>Insights from stop and search data released by 'police.uk'.</p>
                <Link to="/stopsearch">Discover insights here</Link>
              </div>
            </div>
          </div>
        </div>
    );
}

export default Home;