import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { UserList } from "./components/UserList";
import { RegisterPage } from "./pages/RegisterPage";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
