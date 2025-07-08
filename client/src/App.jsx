import RouterComponent from "./router";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <RouterComponent />
      </div>
    </>
  );
}
