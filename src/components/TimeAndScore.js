import React from 'react'
import Moment from 'react-moment';

function TimeAndScore(props) {
  if ((props.gameState.search('schedule') !== -1) || (props.gameState.search('pre-game') !== -1)) {
    // game is live
    return(
      <div className="timeAndScore scheduled">
        <div className="timeRemaining">
          <h1><Moment format="dddd, MMM D, h:mm A">{props.gameDate}</Moment></h1>
          <div className="venue">
            <span>{props.venue.name}</span>
            <span>{props.venue.city}</span>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="timeAndScore">
        <div className="timeRemaining">
          <h1>{props.timeLeft}
          { ((props.gameState === 'inprogress') || (props.gameState === 'inprogress-critical') || ((props.currentPeriodOrdinal === 'OT' || props.currentPeriodOrdinal === 'SO') && props.gameState === 'final')) &&
            <span>{props.currentPeriodOrdinal}</span>
          }
          </h1>
          <BannerPeriodTable
            periodData={props.periodData}
            currentPeriod={props.currentPeriod}
            homeName={props.homeTricode}
            awayName={props.awayTricode}
          />
        </div>
      </div>
    )
  }
}

function BannerPeriodTable(props) { // this table displays the goals per team per period
  let data = props.periodData.periods;
  let homeData = [];
  let awayData = [];

  for (let i = 0; i < 3; i++) {
    if (data[i] !== undefined) {
      let homeValue = data[i].home.goals;
      let homeStyle = (homeValue === 0) ? ({color: '#959595'}) : {};
      homeData.push(<td key={i} style={homeStyle}>{homeValue}</td>);
      let awayValue = data[i].away.goals;
      let awayStyle = (awayValue === 0) ? ({color: '#959595'}) : {};
      awayData.push(<td key={i} style={awayStyle}>{awayValue}</td>);
    } else {
      homeData.push(<td key={i} style={{color:'#959595'}}>-</td>);
      awayData.push(<td key={i} style={{color:'#959595'}}>-</td>)
    }
  }
  let overtimeGame = false;
  if (data.length > 3) { // anything over 3 periods is overtime
    overtimeGame = true;
    let homeValue = data[data.length-1].home.goals;
    let homeStyle = (homeValue === 0) ? ({color: '#959595'}) : {};
    homeData.push(<td key={'otGoalsHome'} style={homeStyle}>{homeValue}</td>);
    let awayValue = data[data.length-1].away.goals;
    let awayStyle = (awayValue === 0) ? ({color: '#959595'}) : {};
    awayData.push(<td key={'otGoalsAway'} style={awayStyle}>{awayValue}</td>);
  }

  return(
    <div className="bannerPeriodTable">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            {overtimeGame &&
              <th>OT</th>
            }
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.homeName}</td>
            {homeData}
          </tr>
          <tr>
            <td>{props.awayName}</td>
            {awayData}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TimeAndScore
