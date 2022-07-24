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
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

import loanService from "../../../loan/loan.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  monthNumberToMonthName,
} from "../../../../utils";

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

const getTotalByTypesChartItems = (items) => {
  return items.map((item) => {
    return {
      ...item,
    };
  });
};

const COLORS = ["yellow", "orange", "red", "green"];

const Home = () => {
  const [overviewInfo, setOverviewInfo] = useState(undefined);
  const [overviewInfoLoading, setOverviewInfoLoading] = useState(false);
  const [overviewInfoError, setOverviewInfoError] = useState(undefined);

  const [totalBorrowedPerMonth, setTotalBorrowedPerMonth] = useState([]);
  const [totalBorrowedPerMonthLoading, setTotalBorrowedPerMonthLoading] =
    useState(false);
  const [totalBorrowedPerMonthError, setTotalBorrowedPerMonthError] =
    useState(undefined);

  const [totalByTypes, setTotalByTypes] = useState([]);
  const [totalByTypesLoading, setTotalByTypesLoading] = useState(false);
  const [totalByTypesError, setTotalByTypesError] = useState(undefined);

  const [activeIndex, setActiveIndex] = useState(0);

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

  const fetchTotalByTypes = async () => {
    setTotalByTypesLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getTotalByTypes(),
        delay(),
      ]);

      setTotalByTypes(getTotalByTypesChartItems(data));
    } catch (error) {
      setTotalByTypesError(getMessageFromAxiosError(error));
    }

    setTotalByTypesLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchOverviewInfo();
    fetchTotalBorrowedPerMonth();
    fetchTotalByTypes();
  }, [navigate, user]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`Total ${formatCurrency(value)}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Porcentaje ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

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
            {totalByTypesLoading && (
              <InlineLoading
                status="active"
                description="Cargando..."
                className={"center-screen"}
              />
            )}
            {totalByTypesError && (
              <div
                style={{ marginBottom: "1rem" }}
                className="screen__notification_container"
              >
                <InlineNotification
                  kind="error"
                  subtitle={<span>{totalByTypesError}</span>}
                  title="Uups!"
                  onClose={() => setTotalByTypesError(undefined)}
                />
              </div>
            )}
            {!totalByTypesLoading && !totalByTypesError && totalByTypes && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <div className="cds--row">
                    <div className="cds--col">
                      <p className="screen__label screen__text--center">
                        Totales por tipo:
                      </p>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart width={500} height={300}>
                          <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={totalByTypes}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                            onClick={(_, index) => setActiveIndex(index)}
                          >
                            {totalByTypes.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
