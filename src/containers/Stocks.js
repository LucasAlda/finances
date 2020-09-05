import React, { useState } from "react";
import { Chart } from "react-charts";
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Container,
  Card,
  CardContent,
  Typography,
  Switch,
} from "@material-ui/core";

const Stocks = ({ stocks, today }) => {
  const [notShowed, setShowed] = useState([]);
  const [relative, setRelative] = useState(false);

  const handleToggle = (stock) => {
    setShowed((prev) => {
      const newStock = [...prev];
      if (newStock.indexOf(stock) === -1) {
        newStock.push(stock);
        return newStock;
      } else {
        newStock.splice(newStock.indexOf(stock), 1);
        return newStock;
      }
    });
  };

  const data = [];
  Object.keys(stocks).forEach(
    (name) =>
      notShowed.indexOf(name) !== -1 ||
      data.push({
        label: name,
        data: stocks[name].map((st) => {
          let initial = 1;
          let cant = 1;
          if (name === "AAPL") {
            initial = 4;
            if (new Date(st.date).getTime() < new Date("08/31/2020").getTime()) {
              cant = 4;
            }
          }
          if (name === "TSLA") {
            initial = 5;
            if (new Date(st.date).getTime() < new Date("08/31/2020").getTime()) {
              cant = 5;
            }
          }
          return {
            primary: new Date(st.date),
            secondary: relative ? (st.close / cant / (stocks[name][0].close / initial)) * 100 : st.close / cant,
          };
        }),
      })
  );

  data.forEach((stock) => {
    const actualPrice = today.find((tday) => tday.stock === stock.label).price;
    let initial = 1;
    let cant = 1;
    if (stock.label === "AAPL") {
      initial = 4;
      if (new Date(stock.date).getTime() < new Date("08/31/2020").getTime()) {
        cant = 4;
      }
    }
    if (stock.label === "TSLA") {
      initial = 5;
      if (new Date(stock.date).getTime() < new Date("08/31/2020").getTime()) {
        cant = 5;
      }
    }
    stock.data.push({
      primary: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      secondary: relative ? (actualPrice / cant / (stocks[stock.label][0].close / initial)) * 100 : actualPrice / cant,
    });
  });
  return (
    <Container style={{ paddingTop: 20 }}>
      <Card variant="outlined">
        <CardContent style={{ paddingBottom: 7 }}>
          <Typography variant="h6" component="h2">
            Tu Acciones
          </Typography>
          <List>
            {today.map(({ stock, change, changepct, price }) => {
              const labelId = `checkbox-list-label-${stock}`;

              return (
                <ListItem key={stock} role={undefined} dense={true} button onClick={() => handleToggle(stock)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={notShowed.indexOf(stock) === -1}
                      tabIndex={-1}
                      disableRipple
                      style={{ padding: 3 }}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={stock} />
                  <ListItemSecondaryAction>
                    <span style={{ width: 270, display: "flex", fontSize: 14, justifyContent: "flex-end" }}>
                      <span>{price.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ARS</span>
                      <span
                        className={change > 0 ? "positive" : change < 0 ? "negative" : "neutral"}
                        style={{ width: 130, textAlign: "right" }}
                      >
                        {change > 0 && "+"}
                        {change.toLocaleString("de-DE", { minimumFractionDigits: 2 })} (
                        {Math.abs(changepct).toLocaleString("de-DE", { minimumFractionDigits: 2 })} %)
                      </span>
                    </span>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
      <Card variant="outlined" style={{ marginTop: 20 }}>
        <CardContent style={{ paddingBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="h2">
              Historial
            </Typography>
            <span>
              Relativo
              <Switch
                checked={relative}
                onChange={() => setRelative(!relative)}
                name="relative"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
            </span>
          </div>
          <div style={{ height: 400 }}>
            <Chart
              tooltip
              series={{ showPoints: true }}
              axes={[
                {
                  primary: true,
                  type: "time",
                  position: "bottom",
                  min: 50,
                  max: 150,
                  // filterTicks: (ticks) =>
                  //   ticks.filter((date) => +timeDay.floor(date) === +date),
                },
                { type: "linear", position: "left" },
              ]}
              data={data}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Stocks;
