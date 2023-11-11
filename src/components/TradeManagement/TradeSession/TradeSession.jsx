import React, { Component } from "react";
import { w3cwebsocket as WebSocketClient } from "websocket";
import { Button, Icon, Modal } from "semantic-ui-react";
import TradeSessionForm from './TradeSessionForm/TradeSessionForm';
import "./TradeSession.scss";

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      price: 0,
      modalOpen: false,
    };
  }

  initiateCommunicationChannal = () => {
    console.log("Initiate Communication Channal")
    // this.ws = new WebSocketClient(
    //   "ws://127.0.0.1:8000/ws/initiate_trade_session/?trading_symbol=INFY&exchange=nse&scanning_algorithm=udts&tracking_algorithm=slto"
    // );

    // this.ws.onopen = () => {
    //   console.log("WebSocket connection established.");
    // };

    // this.ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log("new Price", data);

    //   this.setState({ price: data.price });
    // };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleFormSubmit = (formData) => {
    // handle the form data here
    // you can set it to the state or initiate the trade session
    console.log(formData);
    this.setState({ modalOpen: false })
    this.initiateTradeSession(formData);
  };

  initiateTradeSession = (formData) => {
    let { scanningAlgorithm, trackingAlgorithm, tradingFrequency, isDummy } = formData;
    isDummy = isDummy ? 1 : 0;
    let url =
      `http://127.0.0.1:8000/tmu/initiate_trade_session?trading_frequency=${tradingFrequency}&user_id=1&dummy=${isDummy}&scanning_algorithm_name=${scanningAlgorithm}&tracking_algorithm_name=${trackingAlgorithm}`;
    fetch(url)
      .then((response) => {
        if (!response.status !== 200) {
          throw new Error("Session Could not be initiated");
        }
        return response.json();
      })
      .then((data) => {
        this.initiateCommunicationChannel();
      })
  };
  

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    const { modalOpen } = this.state;
    return (
      <div className="trade-session">
        <Modal
          trigger={<Button primary className="init-button" onClick={this.handleOpen}>Create New Session <Icon name="plus" className="plus-icon" /></Button>}
          open={modalOpen}
          onClose={this.handleClose}
        >
          <Modal.Header>Select a Trade Session</Modal.Header>
          <Modal.Content>
            <TradeSessionForm onSubmit={this.handleFormSubmit} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default TradeSession;
