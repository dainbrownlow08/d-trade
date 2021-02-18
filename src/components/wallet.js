import React from "react";
import Plot from "react-plotly.js";
import Table from "react-bootstrap/Table";
import NewDoge from "../containers/NewDoge.png";
import Ethereum from "../containers/Ethereum.png";
import Bitcoin from "../containers/Bitcoin.png";
import XRP from '../containers/XRP.png'
import LTC from '../containers/LTC.png'
import LINK from '../containers/LINK.png'
import XMR from '../containers/XMR.png'
import DOT from '../containers/DOT.png'
import UNI from '../containers/UNI.png'
// import { pub, priv } from "../keys.js";
import OrderForm from "./OrderForm.js";
import Alert from "react-bootstrap/Alert";
const Binance = require("node-binance-api");

class Wallet extends React.Component {
  state = {
    Balance: 0,
    Cash: null,
    BTC: 0,
    ETH: 0,
    DOGE: 0,
    XRP: 0,
    LTC: 0,
    LINK: 0,
    XMR: 0,
    DOT: 0,
    UNI: 0,
    BTCHolding: 0,
    ETHHolding: 0,
    XRPHolding: 0,
    DOGEHolding: 0,
    LTCHolding: 0,
    LINKHolding: 0,
    XMRHolding: 0,
    DOTHolding: 0,
    UNIHolding: 0,
    stockChartXValues: [],
    xCount: 0,
    stockChartYValues: [],
    orders: [],
    graphColor: "green",
    display: false,
    broke: false,
    gl: 0,
    pgl: 0,
  };

  // API PRICES

  prices = () => {
    const binance = new Binance().options({
      APIKEY:
        "WG4DzDb0c8lynHfMv6BGr2wFoeXMUJHCvsfr5R8Fd440uScg1Y3Wono4EjlN3i9a",
      APISECRET:
        "X0kbMbhPp6LzaTdAqGgFuAFOewHjKdNycMfCu3LgnsO4mhT6wwjYHExnC7vnIkua",
    });
    binance.prices("BTCUSDT", (error, ticker) => {
      this.setState({ BTC: parseFloat(ticker.BTCUSDT) }, () => {
        binance.prices("ETHUSDT", (error, ticker) => {
          this.setState({ ETH: parseFloat(ticker.ETHUSDT) }, () => {
            binance.prices("DOGEUSDT", (error, ticker) => {
              this.setState({ DOGE: parseFloat(ticker.DOGEUSDT) }, () => {
                binance.prices("XRPUSDT", (error, ticker) => {
                  this.setState({ XRP: parseFloat(ticker.XRPUSDT) }, () => {
                    binance.prices("LTCUSDT", (error, ticker) => {
                      this.setState({ LTC: parseFloat(ticker.LTCUSDT) }, () => {
                        binance.prices("LINKUSDT", (error, ticker) => {
                          this.setState(
                            { LINK: parseFloat(ticker.LINKUSDT) },
                            () => {
                              binance.prices("XMRUSDT", (error, ticker) => {
                                this.setState(
                                  { XMR: parseFloat(ticker.XMRUSDT) },
                                  () => {
                                    binance.prices(
                                      "DOTUSDT",
                                      (error, ticker) => {
                                        this.setState(
                                          {
                                            DOT: parseFloat(ticker.DOTUSDT),
                                          },
                                          () => {
                                            binance.prices(
                                              "UNIUSDT",
                                              (error, ticker) => {
                                                this.setState(
                                                  {
                                                    UNI: parseFloat(
                                                      ticker.UNIUSDT
                                                    ),
                                                  },
                                                  () => {
                                                    this.getWallet(
                                                      this.props.wallet.id
                                                    );
                                                  }
                                                );
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              });
                            }
                          );
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  // LIFECYCLE

  getWallet = (id) => {
    const pointerToThis = this;
    let newCount = this.state.xCount + 1;
    let date = Date(Date.now());
    let time = date.toString();
    fetch(`http://localhost:3000/wallets/${id}`)
      .then((res) => res.json())
      .then((res) => {
        let btcTotal = res.btc * this.state.BTC;
        let ethTotal = res.eth * this.state.ETH;
        let dogeTotal = res.doge * this.state.DOGE;
        let xrpTotal = res.xrp * this.state.XRP;
        let ltcTotal = res.ltc * this.state.LTC;
        let linkTotal = res.link * this.state.LINK;
        let xmrTotal = res.xmr * this.state.XMR;
        let dotTotal = res.dot * this.state.DOT;
        let uniTotal = res.uni * this.state.UNI;
        let currentBalance =
          res.cash +
          btcTotal +
          ethTotal +
          dogeTotal +
          xrpTotal +
          ltcTotal +
          linkTotal +
          xmrTotal +
          dotTotal +
          uniTotal;
        pointerToThis.setState(
          {
            Cash: res.cash,
            BTCHolding: res.btc,
            ETHHolding: res.eth,
            DOGEHolding: res.doge,
            XRPHolding: res.xrp,
            LTCHolding: res.ltc,
            LINKHolding: res.link,
            XMRHolding: res.xmr,
            DOTHolding: res.dot,
            UNIHolding: res.uni,
            stockChartXValues: [...this.state.stockChartXValues, time],
            stockChartYValues: [
              ...this.state.stockChartYValues,
              currentBalance,
            ],
          },
          () => {
            this.setWallet(id, currentBalance);
          }
        );
      });
  };

  getOrders = () => {
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((orders) => {
        let ourOrders = orders.filter(
          (o) => o.wallet_id == this.props.wallet.id
        );
        ourOrders = ourOrders.slice(0, 11);
        this.setState({
          orders: ourOrders,
        });
      });
  };

  setWallet = (id, newBalance) => {
    fetch(`http://localhost:3000/wallets/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ balance: newBalance }),
    })
      .then((res) => res.json())
      .then((res) => {
        let newColor = this.state.graphColor;
        if (
          this.state.stockChartYValues[
            this.state.stockChartYValues.length - 1
          ] < this.state.stockChartYValues[0] &&
          this.state.graphColor !== "red"
        ) {
          newColor = "red";
        }
        if (
          this.state.stockChartYValues[
            this.state.stockChartYValues.length - 1
          ] > this.state.stockChartYValues[0] &&
          this.state.graphColor !== "green"
        ) {
          newColor = "green";
        }
        this.setState(
          {
            Balance: res.balance,
            graphColor: newColor,
          },
          () => this.handlePortfolioReturn()
        );
      });
  };

  submitOrder = (e, o) => {
    e.preventDefault();
    this.handleOrder(o);
    if (o.type == "Buy") {
      if (o.total > this.state.Cash) {
        this.setState({
          broke: true,
        });
      } else {
        this.handleComplete();
        let quantity = o.quantity;
        let symbol = o.symbol;
        let total = o.total;

        let newQuantity = quantity + this.state[`${symbol}Holding`];
        let newCash = this.state.Cash - parseFloat(total);

        fetch(`http://localhost:3000/wallets/${this.props.wallet.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            [symbol]: newQuantity,
            cash: newCash,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
      }
    }
    if (o.type == "Sell") {
      if (o.quantity > this.state[`${o.symbol}Holding`]) {
        this.setState({
          broke: true,
        });
      } else {
        this.handleComplete();
        let quantity = o.quantity;
        let symbol = o.symbol;
        let total = o.total;

        let newQuantity = this.state[`${symbol}Holding`] - quantity;
        let newCash = this.state.Cash + parseFloat(total);

        fetch(`http://localhost:3000/wallets/${this.props.wallet.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            [symbol]: newQuantity,
            cash: newCash,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
      }
    }
  };

  // HANDLERS

  handleOrder = (o) => {
    let data = {
      ticker: o.symbol,
      quantity: o.quantity,
      total: o.total,
      type: o.type,
      wallet_id: this.props.wallet.id,
    };
    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((order) => {
        console.log(order);
        let newOrders = this.state.orders;
        if (newOrders.length == 10) {
          newOrders.unshift(order);
          newOrders.pop();
        } else {
          newOrders.unshift(order);
        }
        this.setState({
          orders: newOrders,
        });
      });
  };

  toggleForm = () => {
    let newDisplay = !this.state.display;
    this.setState({
      display: newDisplay,
      broke: false,
    });
  };

  handleComplete = () => {
    this.setState({
      broke: false,
      display: false,
    });
  };

  handlePortfolioReturn = () => {
    if (this.state.stockChartYValues.length > 1) {
      if (this.state.Balance >= this.state.stockChartYValues[0]) {
        let pos = (
          this.state.Balance - this.state.stockChartYValues[0]
        ).toFixed(2);
        let posPercent = (
          (pos / this.state.stockChartYValues[0]) *
          100
        ).toFixed(5);
        this.setState({
          gl: pos,
          pgl: posPercent,
        });
      } else {
        let neg = (
          this.state.Balance - this.state.stockChartYValues[0]
        ).toFixed(2);
        let negPercent = (
          (neg / this.state.stockChartYValues[0]) *
          100
        ).toFixed(5);
        this.setState({
          gl: neg,
          pgl: negPercent,
        });
      }
    }
  };

  // MOUNTING

  componentDidMount() {
    this.prices();
    this.getOrders();
    this.interval = setInterval(this.prices, 5000);
    document.body.style.background = "#121212";
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // RENDER

  render() {
    return (
      <div>
        {this.state.display ? (
          <OrderForm
            prices={{
              "BTC": this.state.BTC,
              "ETH": this.state.ETH,
              "DOGE": this.state.DOGE,
              "XRP": this.state.XRP,
              "LTC": this.state.LTC,
              "LINK": this.state.LINK,
              "XMR": this.state.XMR,
              "DOT": this.state.DOT,
              "UNI": this.state.UNI,
            }}
            Cash={this.state.Cash}
            Holdings={{
              "BTC": this.state.BTCHolding,
              "ETH": this.state.ETHHolding,
              "DOGE": this.state.DOGEHolding,
              "XRP": this.state.XRPHolding,
              "LTC": this.state.LTCHolding,
              "LINK": this.state.LINKHolding,
              "XMR": this.state.XMRHolding,
              "DOT": this.state.DOTHolding,
              "UNI": this.state.UNIHolding,
            }}
            submitOrder={this.submitOrder}
          />
        ) : null}
        {this.state.broke ? (
          <Alert variant={"warning"}>
            <p>Invalid transaction. Please check your balances.</p>
          </Alert>
        ) : null}
        <button onClick={this.toggleForm}>Create Order</button>
        <br></br>
        <div
          id="flex-item"
          style={{
            backgroundColor: "#121212",
            width: 300,
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <h1 style={{ color: "white" }}>Investing</h1>
          <h1 style={{ color: "white" }}>
            ${parseFloat(this.state.Balance).toFixed(2)}
          </h1>

          <h5 style={{ color: this.state.graphColor }}>
            {this.state.graphColor == "green" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill={this.state.graphColor}
                viewBox="0 0 16 16"
              >
                <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill={this.state.graphColor}
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
              </svg>
            )}
            ${this.state.gl}({this.state.pgl}%)
          </h5>
        </div>
        <div
          style={{
            float: "left",
            backgroundColor: "#1F1B24",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4 style={{ color: "white" }}>Current Holdings: </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={Bitcoin} style={{ height: 50, width: 50 }} />
            BTC: {this.state.BTCHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={Ethereum} style={{ height: 50, width: 50 }} />
            ETH: {this.state.ETHHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={NewDoge} style={{ height: 50, width: 50 }} />
            DOGE: {this.state.DOGEHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={XRP} style={{ height: 50, width: 50 }} />
            XRP: {this.state.XRPHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={LTC} style={{ height: 50, width: 50 }} />
            LTC: {this.state.LTCHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={LINK} style={{ height: 50, width: 50 }} />
            LINK: {this.state.LINKHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={XMR} style={{ height: 50, width: 50 }} />
            XMR: {this.state.XMRHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={DOT} style={{ height: 50, width: 50 }} />
            DOT: {this.state.DOTHolding}
          </h4>
          <h4 style={{ color: "white" }}>
            {" "}
            <img src={UNI} style={{ height: 50, width: 50 }} />
            UNI: {this.state.UNIHolding}
          </h4>
        </div>
        <div
          style={{
            float: "right",
            backgroundColor: "#1F1B24",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4 style={{ color: "white" }}>Orders:</h4>
          <Table variant="dark">
            <thead>
              <tr>
                <th>Type</th>
                <th>Ticker</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orders.map((order) => {
                return [
                  <tr>
                    <td>{order.orderType}</td>
                    <td>{order.ticker}</td>
                    <td>{order.quantity}</td>
                    <td>{order.total}</td>
                    <td>{order.created_at}</td>
                  </tr>,
                ];
              })}
            </tbody>
          </Table>
        </div>
        {this.state.stockChartXValues.length > 0 ? (
          <div
            div
            style={{
              margin: "auto",
              backgroundColor: "#1F1B24",
              justifyContent: "center",
              alignItems: "center",
              width: 1000,
            }}
          >
            <Plot
              data={[
                {
                  x: this.state.stockChartXValues,
                  y: this.state.stockChartYValues,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: this.state.graphColor, size: 2 },
                },
              ]}
              layout={{
                shapes: [
                  // {
                  //   type: "line",
                  //   x0: this.stockChartXValues[0],
                  //   y0: this.stockChartYValues[0],
                  //   x1: this.stockChartXValues[this.stockChartXValues.length - 1],
                  //   y1: this.stockChartYValues[0],
                  // },
                ],
                width: 981,
                height: 600,
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                xaxis: {
                  showgrid: false,
                  visible: false,
                },
                yaxis: {
                  showgrid: false,
                  showline: true,
                },
              }}
            />
            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 300,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={Bitcoin} style={{ height: 50, width: 50 }} />
                BTC: {parseFloat(this.state.BTC).toFixed(2)}
              </h2>
            </div>
            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 300,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img
                  src={Ethereum}
                  style={{ height: 50, width: 50 }}
                /> ETH: {parseFloat(this.state.ETH).toFixed(2)}
              </h2>
            </div>
            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 350,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={NewDoge} style={{ height: 50, width: 50 }} />
                DOGE: {parseFloat(this.state.DOGE).toFixed(7)}
              </h2>
            </div>
            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 300,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={XRP} style={{ height: 50, width: 50 }} />
                XRP: {parseFloat(this.state.XRP).toFixed(5)}
              </h2>
            </div>

            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 300,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={LTC} style={{ height: 50, width: 50 }} />
                LTC: {parseFloat(this.state.LTC).toFixed(5)}
              </h2>
            </div>

            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 350,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={LINK} style={{ height: 50, width: 50 }} />
                LINK: {parseFloat(this.state.LINK).toFixed(5)}
              </h2>
            </div>

            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 350,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={XMR} style={{ height: 50, width: 50 }} />
                XMR: {parseFloat(this.state.XMR).toFixed(5)}
              </h2>
            </div>

            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 300,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={DOT} style={{ height: 50, width: 50 }} />
                DOT: {parseFloat(this.state.DOT).toFixed(5)}
              </h2>
            </div>

            <div
              id="flex-item"
              style={{
                backgroundColor: "#1F1B24",
                width: 300,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                float: "left",
              }}
            >
              <h2 style={{ color: "white" }}>
                {" "}
                <img src={UNI} style={{ height: 50, width: 50 }} />
                UNI: {parseFloat(this.state.UNI).toFixed(5)}
              </h2>
            </div>
          </div>
        ) : null}
        <br></br>
      </div>
    );
  }
}

export default Wallet;
