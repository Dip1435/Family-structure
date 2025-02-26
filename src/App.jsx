import Layout from "./components/common/Layout";
import "reactflow/dist/style.css";
import Header from "./components/common/Header";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <div className="container mx-auto outline-1 outline-purple-100">
      <Header />
      <Layout />
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
