import React, { useState } from "react";
import { Content, Theme } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./app.scss";

import firebaseApp from "./firebase";

import AppHeader from "./components/AppHeader";

import Landing from "./modules/main/views/Landing";

import Login from "./modules/auth/views/Login";
import ResetPassword from "./modules/auth/views/ResetPassword";

import Home from "./modules/main/views/Home";

import Borrowers from "./modules/user/views/Borrowers";
import Borrower from "./modules/user/views/Borrower";
import BorrowerLoans from "./modules/user/views/BorrowerLoans";
import BorrowerLoan from "./modules/user/views/BorrowerLoan";
import BorrowerLoanMovements from "./modules/user/views/BorrowerLoanMovements";

export const GlobalContext = React.createContext();

const App = () => {
  const [user, setUser] = useState(undefined);

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <>
      <GlobalContext.Provider value={{ user }}>
        <Theme theme="g100">
          <AppHeader />
        </Theme>
        <Content>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/home" element={<Home />} />

            <Route path="/borrowers" element={<Borrowers />} />
            <Route path="/borrowers/:authUid" element={<Borrower />} />
            <Route path="/borrowers/:authUid/loans" element={<BorrowerLoans />} />
            <Route path="/borrowers/:authUid/loans/:loanUid" element={<BorrowerLoan />} />
            <Route path="/borrowers/:authUid/loans/:loanUid/movements" element={<BorrowerLoanMovements />} />
          </Routes>
        </Content>
      </GlobalContext.Provider>
    </>
  );
};

export default App;
