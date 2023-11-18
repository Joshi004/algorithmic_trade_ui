import React, { Component } from 'react';
import { Label, Icon, Card } from 'semantic-ui-react';
import { orderBy } from 'lodash'; // Import the orderBy function from lodash
import classNames from 'classnames'; // Import the classNames function
import './TradeBar.scss';

class TradeBar extends Component {
  state = {
    sortKey: null,
    sortDirection: null,
    selectedTrade: null
  };

  onHeaderClick = (key) => {
    const { sortKey, sortDirection } = this.state;
    if (sortKey === key && sortDirection === 'asc') {
      this.setState({ sortDirection: 'desc' });
    } else {
      this.setState({ sortKey: key, sortDirection: 'asc' });
    }
  }

  onTradeClick = (trade) => {
    if(trade.trade_id !== this.state?.selectedTrade?.trade_id){
      this.setState({ selectedTrade: trade });
      this.props.handleTradeSelection(trade);
    }

  }

  renderTrade = (trade) => {
    const { instrument: { instrument_name }, traded_quantity, trade_view, trade_net_profit, trade_id } = trade;
    const netProfit = trade_net_profit || 0; // Use 0 if trade_net_profit is null or undefined
    const isProfit = netProfit > 0;
    const isLoss = netProfit < 0;
    const profitColor = isProfit ? 'green' : isLoss ? 'red' : 'grey';
    const arrowDirection = trade_view === 'long' ? 'up' : 'down';
    const tradeClass = classNames('trade-bar-item', { 'selected': this.state.selectedTrade?.trade_id === trade_id });
  
    return (
      <div className={tradeClass} onClick={() => this.onTradeClick(trade)}>
        <span className="instrument-name" title={instrument_name}>{instrument_name}</span>
        <span className="quantity">
          <Icon name={`arrow ${arrowDirection}`} />
          ({traded_quantity})
        </span>
        <Label color={profitColor} className="trade-net-profit">
          {Math.abs(netProfit)} {/* Use the absolute value of netProfit to remove the sign */}
        </Label>
      </div>
    );
  }
  
  
  render() {
    const { trades } = this.props;
    const { sortKey, sortDirection } = this.state;
    const sortedTrades = orderBy(trades, [sortKey], [sortDirection]);  
    return (
      <Card className="trade-bar">
        <div className="trade-bar-header">
          <span className="instrument-name" onClick={() => this.onHeaderClick('instrument.instrument_name')}>
            Instrument <Icon name="sort" />
          </span>
          <span className="quantity" onClick={() => this.onHeaderClick('traded_quantity')}>
            <Icon name="sort" />
          </span>
          <span className="trade-net-profit" onClick={() => this.onHeaderClick('trade_net_profit')}>
            <Icon name="sort" />
          </span>
        </div>
        <div className="trade-bar-content">
          {sortedTrades.map(this.renderTrade)}
        </div>
      </Card>
    );
  }   
}
export default TradeBar;
