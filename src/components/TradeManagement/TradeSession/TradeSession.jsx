import React, { Component } from "react";
import { w3cwebsocket as WebSocketClient } from "websocket";
import { Button, Icon, Modal } from "semantic-ui-react";
import TradeSessionForm from "./TradeSessionGrid/TradeSessionForm/TradeSessionForm";
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
      sessions: [],
      newSessionId: null,
      selectedSessionId: null,
    };
  }

  componentDidMount() {
    this.fetchTradeSessionsInfo();
  }

  fetchTradeSessionsInfo = () => {
    fetch("http://127.0.0.1:8000/tmu/get_trade_sessions?user_id=1&dummy=1")
      .then((response) => response.json())
      .then((data) => {
        const sessions = data.data.trade_sessions;
        const sessionIds = sessions.map((session) => session.id).join(",");
        fetch(
          `http://127.0.0.1:8000/tmu/session_active?trade_session_id=${sessionIds}`
        )
          .then((response) => response.json())
          .then((statusData) => {
            const statusMap = {};
            statusData.data.forEach((item) => {
              statusMap[item.trade_session_id] = item.status;
            });
            const updatedSessions = sessions.map((session) => ({
              ...session,
              status: statusMap[session.id],
            }));
            this.setState({ sessions: updatedSessions });
          });
      });
  };

  initiateCommunicationChannal = (tradeSessionID) => {
    console.log("Initiate Communication Channal");
    this.ws = new WebSocketClient(
      `ws://127.0.0.1:8000/ws/setup_trade_session_commnication/?trade_session_id=${tradeSessionID}`
    );

    this.ws.onopen = () => {
      console.log(`Connection Establish for SessionID : ${tradeSessionID}`);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
  };

  terminateTradeSession = (trade_session_id) => {
    fetch(
      `http://127.0.0.1:8000/tmu/terminate_trade_session?trade_session_id=${trade_session_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data.trade_session_id === trade_session_id) {
          this.setState((prevState) => {
            const updatedSessions = prevState.sessions.map((session) => {
              if (session.id === trade_session_id) {
                return { ...session, status: "terminated" };
              }
              return session;
            });
            return { sessions: updatedSessions };
          });
        }
      });
  };

  resumeTradeSession = (sessionId) => {
    const url = `http://127.0.0.1:8000/tmu/resume_trade_session?trade_session_id=${sessionId}`;
    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Update the status of the session in the state
        this.setState((prevState) => {
          const updatedSessions = prevState.sessions.map((session) => {
            if (session.id === sessionId) {
              return { ...session, status: "active" };
            }
            return session;
          });
          return { sessions: updatedSessions };
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  handleTradeSessionDetails = (selectedSessionId) => {
    console.log("Selected Trade Session", selectedSessionId);
    let selectedSessionIndex = this.state.sessions.findIndex(
      (session) => session.id === selectedSessionId
    );
    this.setState({ selectedSessionId, selectedSessionIndex });
  };

  handleMessage = (data) => {
    if (
      data.event_type === "terminate_trade" ||
      data.event_type === "initiate_trade"
    ) {
      const sessionIndex = this.state.sessions.findIndex(
        (session) => session.id === data.trade_session_id
      );
      let session = { ...this.state.sessions[sessionIndex] };
      session.net_profit += data.net_profit;
      let sessions = [...this.state.sessions];
      sessions[sessionIndex] = session;
      this.setState({ sessions });
    }
  };

  handleFormSubmit = (formData) => {
    this.initiateTradeSession(formData);
  };

  populateTradeSession = (tradeSessionID) => {
    let existing = false;
    this.state.sessions.forEach((session) => {
      if (session.id === tradeSessionID) {
        existing = true;
        return;
      }
    });

    if (existing) {
      this.setState({ newSessionId: tradeSessionID }, () => {
        setTimeout(() => this.setState({ newSessionId: null }), 2000);
      });
    } else {
      fetch(
        `http://127.0.0.1:8000/tmu/get_trade_sessions?session_id=${tradeSessionID}`
      )
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            sessions: [...this.state.sessions, ...data.data.trade_sessions],
          })
        );
    }
  };

  initiateTradeSession = (formData) => {
    let { scanningAlgorithm, trackingAlgorithm, tradingFrequency, isDummy } =
      formData;
    isDummy = isDummy ? 1 : 0;
    let url = `http://127.0.0.1:8000/tmu/initiate_trade_session?trading_frequency=${tradingFrequency}&user_id=1&dummy=${isDummy}&scanning_algorithm_name=${scanningAlgorithm}&tracking_algorithm_name=${trackingAlgorithm}`;
    fetch(url)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Session Could not be initiated");
        }
        return response.json();
      })
      .then((data) => {
        this.populateTradeSession(data.trade_session_id);
        this.initiateCommunicationChannal(data.trade_session_id);
      });
  };

  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }

  render() {
    const { selectedSessionIndex } = this.state;
    return (
      <div className="trade-session">
        {this.state.selectedSessionId ? (
          <TradeSessionDetail
            sessionInfo={this.state.sessions[selectedSessionIndex]}
          />
        ) : (
          <div className="trade-session">
            <TradeSessionGrid
              terminateTradeSession={this.terminateTradeSession}
              resumeTradeSession={this.resumeTradeSession}
              handleFormSubmit={this.handleFormSubmit}
              handleTradeSessionDetails={this.handleTradeSessionDetails}
              sessions={this.state.sessions}
              newSessionId={this.state.newSessionId}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TradeSession;
