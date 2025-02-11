import { useEffect, useState } from "react";
import familyData from "./data.json";
import FamilyTreeNode from "./components/FamilyTree";
import FamilyList from "./components/FamilyList";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import 'reactflow/dist/style.css';
import Header from "./components/Header";
const App = () => {
  const [data, setData] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(
    JSON.parse(localStorage.getItem("selectedFamily")) || null
  );

  useEffect(() => {
    setData(familyData[selectedFamily]);
  }, [selectedFamily]);

  return (
    <div className=" mx-auto">
     <Header />
     <FamilyList data={familyData} setSelectedFamily={setSelectedFamily} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
