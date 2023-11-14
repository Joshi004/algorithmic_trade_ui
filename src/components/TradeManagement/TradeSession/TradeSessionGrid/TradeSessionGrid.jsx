import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import TradeSessionCard from "./TradeSessionCard/TradeSessionCard";
import './TradeSessionGrid.scss'
class TradeSessionGrid extends Component {
    constructor(props) {
      super(props);
      this.state = {
        sessions: [],
      };
    }
  
  
    render() {
      const { sessions,newSessionId } = this.props;
      return (
        <div className="trade-session-grid">
          {sessions.map((session) => (
            <TradeSessionCard key={session.id} session={session} isNewSession={session.id === newSessionId}/>
          ))}
        </div>
      );
    }
  }
  
  

  export default TradeSessionGrid