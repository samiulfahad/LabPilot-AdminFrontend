import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import Home from "./pages/home";
import Lab from "./pages/labs";
import Zone from "./pages/zones";
import Test from "./pages/tests";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/labs" element={<Lab />} />
        <Route path="/zones" element={<Zone />} />
        <Route path="/tests" element={<Test />} />
      </Routes>
    </Layout>
  );
}

export default App;
