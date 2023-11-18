import React, { Component } from "react";
import { w3cwebsocket as WebSocketClient } from "websocket";
import { Button, Icon, Modal } from "semantic-ui-react";
import TradeSessionForm from './TradeSessionGrid/TradeSessionForm/TradeSessionForm';
import TradeSessionGrid from "./TradeSessionGrid/TradeSessionGrid";
import "./TradeSession.scss";
import TradeSessionDetail from "./TradeSessionDetail/TradeSessionDetail";

class TradeSession extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      price: 0,
      modalOpen: false,
      sessions:[],
      newSessionId: null,
      selectedSessionId : null
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8000/tmu/get_trade_sessions?user_id=1&dummy=1&is_active=1")
      .then((response) => response.json())
      .then((data) => this.setState({ sessions: data.data.trade_sessions }));
  }

  initiateCommunicationChannal = (tradeSessionID) => {
    console.log("Initiate Communication Channal")
    this.ws = new WebSocketClient(
      `ws://127.0.0.1:8000/ws/setup_trade_session_commnication/?trade_session_id=${tradeSessionID}`
    );
    
    this.ws.onopen = () => {
      console.log(`Connection Establish for SessionID : ${tradeSessionID}`);
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data)
   
    };
  }

  handleTradeSessionDetails = (selectedSessionId)=>{
    console.log("Selected Trade Session",selectedSessionId)
    let selectedSessionIndex = this.state.sessions.findIndex(session => session.id === selectedSessionId);
    this.setState({selectedSessionId,selectedSessionIndex})  
  }

  handleMessage = (data)=>{
      if (data.event_type === "terminate_trade" || data.event_type === "initiate_trade") {
        const sessionIndex = this.state.sessions.findIndex(session => session.id === data.trade_session_id);
        let session = {...this.state.sessions[sessionIndex]};
        session.net_profit += data.net_profit;
        let sessions = [...this.state.sessions];
        sessions[sessionIndex] = session;
        this.setState({ sessions });
      }
  }


  handleFormSubmit = (formData) => {
    this.initiateTradeSession(formData);
  };

  populateTradeSession = (tradeSessionID)=>{
    let existing = false
    this.state.sessions.forEach((session)=>{
      if (session.id === tradeSessionID){
        existing = true
        return
      } })

      if(existing){
        this.setState({ newSessionId: tradeSessionID }, () => {
          setTimeout(() => this.setState({ newSessionId: null }), 2000);
        });
      }else{
        fetch(`http://127.0.0.1:8000/tmu/get_trade_sessions?session_id=${tradeSessionID}`)
        .then((response) => response.json())
        .then((data) => this.setState({ sessions: [...this.state.sessions, ...data.data.trade_sessions ] }));
      }
  }

  initiateTradeSession = (formData) => {
    let { scanningAlgorithm, trackingAlgorithm, tradingFrequency, isDummy } = formData;
    isDummy = isDummy ? 1 : 0;
    let url =
      `http://127.0.0.1:8000/tmu/initiate_trade_session?trading_frequency=${tradingFrequency}&user_id=1&dummy=${isDummy}&scanning_algorithm_name=${scanningAlgorithm}&tracking_algorithm_name=${trackingAlgorithm}`;
    fetch(url)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Session Could not be initiated");
        }
        return response.json();
      })
      .then((data) => {
        this.populateTradeSession(data.trade_session_id)
        this.initiateCommunicationChannal(data.trade_session_id);     
      })
  };
  
  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    const {selectedSessionIndex } = this.state;
    return (
      <div className="trade-session">
        {this.state.selectedSessionId ? 
        <TradeSessionDetail sessionInfo={this.state.sessions[selectedSessionIndex]}/> :
        <div className="trade-session">
        <TradeSessionGrid handleFormSubmit = {this.handleFormSubmit} sessions={this.state.sessions} newSessionId={this.state.newSessionId} handleTradeSessionDetails = {this.handleTradeSessionDetails}/>
      </div>}
      </div>
    );
  }
}

export default TradeSession;
