import "./styles.css";
import { Route, Link, Routes } from "react-router-dom";
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
          <div style={linkStyle}>🖼️ Gallery</div>
        </Link>
      </nav>
      <hr />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
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
