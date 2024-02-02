import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/sign-up/signUp';
import Login from "./components/login/login";
import Base from "./components/base/base";
import Inbox from "./components/inbox/inbox";
import AddChat from "./components/add-chat/addChat";

const App: React.FC = () => {
    return (
      <Router>
          <Routes>
              <Route path="/" element={<Base />} />
                  {/*<Route index element={<AddChat />} />*/}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
  );
};

export default App;
