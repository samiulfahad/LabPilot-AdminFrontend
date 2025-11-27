import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import Home from "./pages/home";
import Lab from "./pages/lab";
import Zone from "./pages/zone";
import Test from "./pages/test";
import LabManagement from "./pages/labManagement";
import TestComponent from "./pages/schemaBuilder";
import SchemaList from "./pages/schemaList";
import SchemaBuilder from "./pages/schemaBuilder";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/labs" element={<Lab />} />
        <Route path="/zones" element={<Zone />} />
        <Route path="/tests" element={<Test />} />
        <Route path="/lab-management" element={<LabManagement />} />
        <Route path="/schema-builder" element={<SchemaBuilder />} />
         <Route path="/schema-builder/:schemaId" element={<SchemaBuilder />} />
        <Route path="/schema-list" element={<SchemaList />} />
        <Route path="/testComponent" element={<TestComponent />} />
      </Routes>
    </Layout>
  );
}

export default App;
