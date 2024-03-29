import React, { useState } from "react";
import { Content, Theme, InlineLoading } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./app.scss";

import firebaseApp from "./firebase";

import { delay } from "./utils";

import AppHeader from "./components/AppHeader";

import Landing from "./modules/main/views/Landing";

import Login from "./modules/auth/views/Login";
import ResetPassword from "./modules/auth/views/ResetPassword";

import Home from "./modules/main/views/Home";

import Borrowers from "./modules/borrower/views/Borrowers";
import Borrower from "./modules/borrower/views/Borrower";
import BorrowerLoanCreate from "./modules/borrower/views/BorrowerLoanCreate";
import BorrowerLoans from "./modules/borrower/views/BorrowerLoans";
import BorrowerLoan from "./modules/borrower/views/BorrowerLoan";
import BorrowerLoanMovements from "./modules/borrower/views/BorrowerLoanMovements";
import BorrowerLoanPayment from "./modules/borrower/views/BorrowerLoanPayment";
import BorrowerLoanRequests from "./modules/borrower/views/BorrowerLoanRequests";
import BorrowerLoanRequest from "./modules/borrower/views/BorrowerLoanRequest";

export const GlobalContext = React.createContext();

const App = () => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);

    delay(500).then(() => {
      setLoading(false);
    });
  });

  return (
    <>
      <GlobalContext.Provider value={{ user }}>
        {loading && (
          <InlineLoading
            status="active"
            iconDescription="Active loading indicator"
            description="Cargando..."
            className={"center-screen"}
          />
        )}
        {!loading && user !== undefined && (
          <>
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
                <Route
                  path="/borrowers/:authUid/loans"
                  element={<BorrowerLoans />}
                />
                <Route
                  path="/borrowers/:authUid/loans/create"
                  element={<BorrowerLoanCreate />}
                />
                <Route
                  path="/borrowers/:authUid/loans/:loanUid"
                  element={<BorrowerLoan />}
                />
                <Route
                  path="/borrowers/:authUid/loans/:loanUid/movements"
                  element={<BorrowerLoanMovements />}
                />
                <Route
                  path="/borrowers/:authUid/loans/:loanUid/report-payment"
                  element={<BorrowerLoanPayment />}
                />
                <Route
                  path="/borrowers/:authUid/loan-requests"
                  element={<BorrowerLoanRequests />}
                />
                <Route
                  path="/borrowers/:authUid/loan-requests/:loanRequestUid"
                  element={<BorrowerLoanRequest />}
                />
              </Routes>
            </Content>
          </>
        )}
      </GlobalContext.Provider>
    </>
  );
};

export default App;
