import "./styles.css";
import { Route, Link, Switch, Redirect } from "react-router-dom";
import Home from "./Home";
import Create from "./Create";
import Gallery from "./Gallery";

function App() {
  return (
    <>
      <nav style={navbarStyle}>
        <Link to="/">
          <div style={linkStyle}>🌈 Creators Corner</div>
        </Link>
        <Link to="/create">
          <div style={linkStyle}>🎨 Create</div>
        </Link>
        <Link to="/gallery">
          <div style={linkStyle}>🖼️ My Gallery</div>
        </Link>
      </nav>
      <hr />
      <main>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/create">
            <Create />
          </Route>
          <Route exact path="/gallery">
            <Gallery />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </>
  );
}

const linkStyle = {
  marginRight: 40,
  color: "black",
};

const navbarStyle = {
  margin: 40,
};

export default App;
