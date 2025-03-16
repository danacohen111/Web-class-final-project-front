import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppMenu from "./components/menu/appMenu";
import AppRoutes from "./components/routes/AppRoutes";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/signup" && <AppMenu />}
      <AppRoutes />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;