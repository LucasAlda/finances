import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { GoogleSpreadsheet } from "google-spreadsheet";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Stocks from "./containers/Stocks";
import Navbar from "./components/Navbar";

function App() {
  const [today, setToday] = useState(JSON.parse(localStorage.getItem("today")) || []);
  const [stocks, setStocks] = useState(JSON.parse(localStorage.getItem("stocks")) || {});
  const [wallet, setWallet] = useState(JSON.parse(localStorage.getItem("wallet")) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || []);

  const getDate = (date) => {
    const [day, month, year] = date.split(" ")[0].split("/");
    return new Date(year, month - 1, day);
  };
  useEffect(() => {
    if (user.user === process.env.REACT_APP_USER && user.password === process.env.REACT_APP_PASS) {
      const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET);
      doc
        .useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_ACCOUNT,
          private_key: process.env.REACT_APP_GOOGLE_KEY.replace(/\\n/g, "\n"),
        })
        .then(() => {
          doc.loadInfo().then(async (info) => {
            [...doc.sheetsByIndex].forEach(async (sheet) => {
              const rows = await sheet.getRows();
              if (sheet.title === "HOY") {
                const data = rows.map((d) => ({
                  stock: d.Stock,
                  price: parseFloat(d.Price),
                  change: parseFloat(d.Change),
                  changepct: parseFloat(d.Changepct),
                }));
                window.localStorage.setItem("today", JSON.stringify(data));
                setToday(data);
              } else if (sheet.title === "TENENCIA") {
                const data = rows.map((d) => ({
                  date: getDate(d.Date),
                  price: parseFloat(d.Price),
                  cant: parseFloat(d.Cant),
                  stock: d.Stock,
                }));
                window.localStorage.setItem("wallet", JSON.stringify(data));
                setWallet(data);
              } else {
                const data = rows.map((d) => ({
                  date: getDate(d.Date),
                  close: parseFloat(d.Close),
                  high: parseFloat(d.High),
                  low: parseFloat(d.Low),
                  open: parseFloat(d.Open),
                  volume: parseFloat(d.Volume),
                }));
                let newStocks = {};
                setStocks((prev) => {
                  newStocks = { ...prev, [sheet.title]: data };
                  return newStocks;
                });
                window.localStorage.setItem("stocks", JSON.stringify(newStocks));
              }
            });
          });
        });
    } else {
      localStorage.clear();
    }
  }, [user]);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            return user.user ? <Home stocks={stocks} today={today} wallet={wallet} /> : <Redirect to="/login" />;
          }}
        />
        <Route
          path="/cotizacion"
          exact
          render={() => {
            return user.user ? <Stocks stocks={stocks} today={today} /> : <Redirect to="/login" />;
          }}
        />
        <Route path="/login" exact render={({ history }) => <Login history={history} setUser={setUser} />} />
      </Switch>
    </Router>
  );
}

export default App;
