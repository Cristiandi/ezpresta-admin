import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InlineLoading, InlineNotification, Button } from "@carbon/react";
import { ChevronRight } from "@carbon/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import loanService from "../../../loan/loan.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  monthNumberToMonthName,
} from "../../../../utils";

import TotalByTypesPieChart from "../../../../components/TotalByTypesPieChart";

import { GlobalContext } from "../../../../App.jsx";

const greet = () => {
  const d = new Date();
  const hour = d.getHours();

  if (hour < 12) {
    return "Buenos días";
  }
  if (hour >= 12 && hour < 18) {
    return "Buenas tardes";
  }
  if (hour >= 18) {
    return "Buenas noches";
  }
};

const getLoanAmountsChartItems = (items) => {
  return items.map((item) => {
    return {
      month:
        monthNumberToMonthName(item.month) + " - " + (item.year + "").slice(2),
      Monto: item.amount,
    };
  });
};

const Home = () => {
  const [overviewInfo, setOverviewInfo] = useState(undefined);
  const [overviewInfoLoading, setOverviewInfoLoading] = useState(false);
  const [overviewInfoError, setOverviewInfoError] = useState(undefined);

  const [totalBorrowedPerMonth, setTotalBorrowedPerMonth] = useState([]);
  const [totalBorrowedPerMonthLoading, setTotalBorrowedPerMonthLoading] =
    useState(false);
  const [totalBorrowedPerMonthError, setTotalBorrowedPerMonthError] =
    useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const fetchOverviewInfo = async () => {
    setOverviewInfoLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getOverview({ authUid: user.uid }),
        delay(),
      ]);

      setOverviewInfo(data);
    } catch (error) {
      console.error(error);
      setOverviewInfoError(getMessageFromAxiosError(error));
    }

    setOverviewInfoLoading(false);
  };

  const fetchTotalBorrowedPerMonth = async () => {
    setTotalBorrowedPerMonthLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getTotalBorrowedPerMonth(),
        delay(),
      ]);

      setTotalBorrowedPerMonth(getLoanAmountsChartItems(data));
    } catch (error) {
      setTotalBorrowedPerMonthError(getMessageFromAxiosError(error));
    }

    setTotalBorrowedPerMonthLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchOverviewInfo();
    fetchTotalBorrowedPerMonth();
  }, [navigate, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <div style={{ marginBottom: "1rem" }}>
            <p>{greet()}</p>
            {overviewInfoLoading && (
              <InlineLoading
                status="active"
                description="Cargando..."
                className={"center-screen"}
              />
            )}
            {overviewInfoError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{overviewInfoError}</span>}
                  title="Uups!"
                  onClose={() => setOverviewInfoError(undefined)}
                />
              </div>
            )}
            {!overviewInfoLoading && !overviewInfoError && overviewInfo && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <div className="cds--row">
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        Número de préstamos:
                      </p>
                      <h3 className="screen__text--center">
                        <strong>{overviewInfo.numberOfLoans}</strong>
                      </h3>
                    </div>
                  </div>
                  <div className="cds--row">
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        Total en saldos:
                      </p>
                      <p className="screen__text--center">
                        {formatCurrency(overviewInfo.totalLoansAmount)}
                      </p>
                    </div>
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        Total en pagos minimos:
                      </p>
                      <p className="screen__text--center">
                        {formatCurrency(
                          overviewInfo.totalLoansMinimumPaymentAmount
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <Button
                    kind="ghost"
                    size="sm"
                    label="Ver prestatarios"
                    iconDescription="Ver prestatarios"
                    renderIcon={ChevronRight}
                    onClick={() => navigate("/borrowers")}
                  >
                    Ver prestatarios
                  </Button>
                </div>
              </>
            )}
            {totalBorrowedPerMonthLoading && (
              <InlineLoading
                status="active"
                description="Cargando..."
                className={"center-screen"}
              />
            )}
            {totalBorrowedPerMonthError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{totalBorrowedPerMonthError}</span>}
                  title="Uups!"
                  onClose={() => setTotalBorrowedPerMonthError(undefined)}
                />
              </div>
            )}
            {!totalBorrowedPerMonthLoading &&
              !totalBorrowedPerMonthError &&
              totalBorrowedPerMonth && (
                <>
                  <div style={{ marginBottom: "1rem" }}>
                    <div className="cds--row">
                      <div className="cds--col">
                        <p className="screen__label screen__text--center">
                          Prestado por mes:
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            width={500}
                            height={300}
                            data={totalBorrowedPerMonth}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis
                              tickFormatter={(value) =>
                                new Intl.NumberFormat("es-CO", {
                                  notation: "compact",
                                  compactDisplay: "short",
                                }).format(value)
                              }
                            />
                            <Tooltip
                              formatter={(value) => formatCurrency(value)}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="Monto"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}
            <TotalByTypesPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
