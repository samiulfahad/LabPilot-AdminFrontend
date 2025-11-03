import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import Home from "./pages/home";
import Lab from "./pages/lab";
import Zone from "./pages/zone";
import Test from "./pages/test";

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
