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
  Divider,
} from "@material-ui/core";

const Home = ({ stocks, today, wallet }) => {
  const [notShowed, setShowed] = useState(["PESOS"]);
  const [neto, setNeto] = useState(true);
  // const [dolar, setDolar] = useState({});

  // useEffect(() => {
  //   fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
  //     .then((data) => data.json())
  //     .then((data) => setDolar(data[1].casa));
  // }, []);

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

  const totalWallet = {};
  wallet.forEach((purchase) => {
    const prev = totalWallet[purchase.stock] || { cant: 0, cost: 0, value: 0 };
    totalWallet[purchase.stock] = {
      cant: prev.cant + purchase.cant,
      cost: prev.cost + purchase.cant * purchase.price,
      value: prev.value + purchase.cant * (today.find((st) => st.stock === purchase.stock)?.price || 1),
    };
  });

  const data = [];
  const changes = [...wallet];
  const lastChange = {};
  let totalHistory = [];
  let pesosHistory = [];
  let relativeData = [];
  // let totalCosto = [];

  Object.keys(stocks).forEach((name) =>
    data.push({
      label: name,
      data: stocks[name].map((st) => {
        const change = changes.find((ch) => {
          return new Date(ch.date).getTime() === new Date(st.date).getTime() && ch.stock === name;
        });
        if (change) {
          lastChange[name] = (lastChange[name] || 0) + change.cant;
          changes.splice(changes.indexOf(change), 1);
        }
        const res = {
          primary: new Date(st.date),
          secondary: (lastChange[name] || 0.00001) * st.close,
        };
        return res;
      }),
    })
  );

  if (Object.keys(stocks).length > 0) {
    pesosHistory = stocks[Object.keys(stocks)[0]].map(({ date }) => {
      const change = changes.find((ch) => {
        return ch.stock === "PESOS" && new Date(ch.date).getTime() === new Date(date).getTime();
      });
      if (change) lastChange.PESOS = (lastChange.PESOS || 0) + change.cant;
      return { primary: new Date(date), secondary: lastChange.PESOS || 0.00001 };
    });

    data.push({ label: "PESOS", data: pesosHistory });
  }

  data.forEach((stock) => {
    const actualPrice = totalWallet[stock.label].value;
    stock.data.push({
      primary: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      secondary: actualPrice,
    });
  });

  relativeData = JSON.parse(JSON.stringify(data)).filter((st) => st.label !== "PESOS");

  if (Object.keys(stocks).length > 0) {
    totalHistory = data[0].data.map(({ primary: date }) => {
      let sum = 0;
      data.forEach((stock) => {
        if (!neto && stock.label === "PESOS") return;
        sum +=
          stock.data.find((d) => {
            return new Date(d.primary).getTime() === new Date(date).getTime();
          })?.secondary || 0;
      });
      return { primary: new Date(date), secondary: sum };
    });

    data.push({ label: "TOTAL", data: totalHistory });
    data[0].data.map(({ primary: date }) => {
      const totalH = totalHistory.find((th) => new Date(th.primary).getTime() === new Date(date).getTime());
      const totalP = pesosHistory.find((ph) => new Date(ph.primary).getTime() === new Date(date).getTime());
      relativeData.forEach((stock) => {
        const subStock = stock.data.find((st) => new Date(st.primary).getTime() === new Date(date).getTime());
        if (subStock) {
          subStock.secondary = (subStock.secondary / (totalH.secondary - totalP.secondary)) * 100;
          subStock.primary = new Date(subStock.primary);
        }
      });
    });
  }

  notShowed.forEach((stock) => {
    data.splice(
      data.findIndex((d) => d.label === stock),
      1
    );
  });

  let total = 0;

  return (
    <Container style={{ paddingTop: 20 }}>
      <Card variant="outlined">
        <CardContent style={{ paddingBottom: 7 }}>
          <Typography variant="h6" component="h2">
            Tu Cartera
          </Typography>
          <List>
            {Object.keys(totalWallet).map((stock) => {
              const { cant, value } = totalWallet[stock];
              const labelId = `checkbox-list-label-${stock}`;
              total += value;

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
                      <span>{parseInt(cant)}</span>
                      <span style={{ width: 130, textAlign: "right" }}>
                        {value.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ARS
                      </span>
                    </span>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
            <Divider />
            <ListItem role={undefined} dense={true}>
              <ListItemText primary={<b style={{ marginLeft: -7 }}>TOTAL</b>} />
              <ListItemSecondaryAction>
                <span
                  style={{ width: 270, display: "flex", fontSize: 14, fontWeight: "bold", justifyContent: "flex-end" }}
                >
                  <span style={{ width: 130, textAlign: "right" }}>
                    {total.toLocaleString("de-DE", { minimumFractionDigits: 2 })} ARS
                  </span>
                </span>
              </ListItemSecondaryAction>
            </ListItem>
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
              Neto
              <Switch
                checked={neto}
                onChange={() => setNeto(!neto)}
                name="neto"
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
      <Card variant="outlined" style={{ marginTop: 20, marginBottom: 80 }}>
        <CardContent style={{ paddingBottom: 7 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="h2">
              Proporcion
            </Typography>
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
                  // filterTicks: (ticks) =>
                  //   ticks.filter((date) => +timeDay.floor(date) === +date),
                },
                { type: "linear", position: "left" },
              ]}
              data={relativeData}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
