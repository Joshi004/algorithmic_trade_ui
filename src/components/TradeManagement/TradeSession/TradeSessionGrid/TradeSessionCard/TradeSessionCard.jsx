import React, { Component } from "react";
import { Card, Popup, Button, Icon, Label, Confirm } from "semantic-ui-react";
import * as Helper from "./TradeSessionCardHelper";
import "./TradeSessionCard.scss";
import { showPopup } from "../../../../Common/Popup/Popup";
import apiService from "../../../../../services/apiService";
import ENDPOINTS from "../../../../../services/endpoints";

class TradeSessionCard extends Component {
  state = { open: false };

  show = () => this.setState({ open: true });
  handleConfirm = () => {
    this.setState({ open: false });
    this.terminateTradeSession(this.props.session.id);
  };
  handleCancel = () => this.setState({ open: false });

  terminateTradeSession = async (trade_session_id) => {
    try {
      const url = `${ENDPOINTS.TRADE_SESSIONS.TERMINATE}?trade_session_id=${trade_session_id}`;
      const response = await fetch(apiService.getApiUrl(url)); // Using fetch directly because we need to check response.ok
      
      if (response.ok) {
        showPopup(
          {
            title: "Terminated Successfully",
            message: `Trade Session ${trade_session_id} terminated successfully`,
          },
          "positive",
          5
        );
        this.props.updateSession(trade_session_id, "status", "terminated");
      }
      
      const data = await response.json();
      
      if (data.status === 202 && data.data.open_trades) {
        // Handle the case where some trades failed to terminate
        const openTradesStr = data.data.open_trades
          .map(
            (trade) =>
              `Trade ID: ${trade.id}, Instrument: ${trade.instrument}`
          )
          .join(", ");
        showPopup(
          {
            title: "Partial Termination",
            message: `Trade Session ${trade_session_id} was partially terminated. The following trades could not be terminated: ${openTradesStr}`,
          },
          "negative",
          5
        );
      }
    } catch (error) {
      // Handle fetch errors
      console.log("Fetch error: ", error);
      showPopup(
        {
          title: "Error",
          message: `An error occurred while terminating the trade session: ${error.message}`,
        },
        "negative",
        5
      );
    }
  };

  resumeTradeSession = async (sessionId) => {
    try {
      const url = `${ENDPOINTS.TRADE_SESSIONS.RESUME}?trade_session_id=${sessionId}`;
      const response = await apiService.get(url);
      
      // Update the status of the session in the state
      this.props.updateSession(sessionId, "status", "active");
    } catch (error) {
      console.error("Error resuming trade session:", error);
    }
  };

  renderCardHeader = (session) => {
    const statusColor =
      session.status === "active"
        ? "green"
        : session.status === "paused"
        ? "yellow"
        : "grey";
    return (
      <Card color={statusColor} className="status-label">
        <Card.Content>
          <Icon
            disabled={
              session.status === "terminated" || session.status === "active"
            }
            name="play circle"
            className="play-icon"
            size="large"
            color={statusColor}
            onClick={() => this.resumeTradeSession(session.id)}
          />
          <span
            className="details"
            onClick={() => {
              this.props.handleTradeSessionDetails(session.id);
            }}
          >
            Session : {session.id}
          </span>
          {session.status !== "terminated" ? (
            <Icon
              className="cross-icon"
              name="close"
              size="large"
              color="grey"
              onClick={this.show}
            />
          ) : null}
          <Confirm
            open={this.state.open}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            content="This will terminate all the trades and this is not a reversible action. Are you sure?"
          />
        </Card.Content>
      </Card>
    );
  };

  renderDetailRow = (label, value, color = "black", title) => {
    title = title || value;
    return (
      <div className="detail-row" style={{ color: color }}>
        <span className="detail-label">{label}</span>|
        <span className="detail-value" title={title}>
          {value}
        </span>
      </div>
    );
  };

  render() {
    const { session, isNewSession } = this.props;
    const duration = Helper.calculateDuration(
      session.started_at,
      session.closed_at
    );
    const durationHover = `Started At : ${session.started_at} Closed At ${
      session.closed_at || "Still Active"
    }`;

    const profitColor =
      session.net_profit > 0
        ? "green"
        : session.net_profit < 0
        ? "red"
        : "grey";

    const algoName =
      session.scanning_algorithm_name + " - " + session.tracking_algorithm_name;
    let blinkClass = isNewSession ? "new-session" : "";
    return (
      <div className={"session-card-component " + blinkClass}>
        <Card>
          {this.renderCardHeader(session)}
          <Card.Content>
            {this.renderDetailRow(
              "Net Profit",
              "Rs. " + Math.abs(session.net_profit) || 0,
              profitColor
            )}
            {this.renderDetailRow("Duration", duration, durationHover)}
            {this.renderDetailRow("Frequency", session.trading_frequency)}
            {this.renderDetailRow("Algorithm", algoName)}
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default TradeSessionCard;
