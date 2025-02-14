import FamilyList from "./components/FamilyList";
import "reactflow/dist/style.css";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <div className="">
      <Header />
      <FamilyList />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
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
