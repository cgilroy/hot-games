import React, { Component } from 'react';
import Moment from 'react-moment';
import resources from './TeamResources.js';

export class SideBarGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: [],
      currentTeamsAndScore: [],
      timeStamp:'',
      homePPBadge:'',
      awayPPBadge:'',
      activeBoxTeam:'home',
      expanded: false
    }
    this.refreshGame = this.refreshGame.bind(this);
    this.sideBarGameClick = this.sideBarGameClick.bind(this);
  }
  refreshGame() {
    let data = this.props.data;
    if ((data.liveData !== undefined) && (data.metaData.timeStamp !== this.state.timeStamp)) {
      let gameState = data.gameData.status.detailedState;
      gameState = gameState.toLowerCase().replace(/\s/g, '');
      let gameTime = data.gameData.datetime.dateTime;
      let homeName = data.gameData.teams.home.name;
      let awayName = data.gameData.teams.away.name;
      let ordinalPeriod = data.liveData.linescore.currentPeriodOrdinal;
      let homeScore = "";
      let awayScore = "";
      if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
        homeScore = data.liveData.linescore.teams.home.goals;
        awayScore = data.liveData.linescore.teams.away.goals;
      }

      let currentTimeStamp = data.metaData.timeStamp;
      let homeTeamOnPP = data.liveData.linescore.teams.home.powerPlay;
      let awayTeamOnPP = data.liveData.linescore.teams.away.powerPlay;
      let homeTriCode = data.gameData.teams.home.abbreviation;
      let awayTriCode = data.gameData.teams.away.abbreviation;

      // depending on state of the game show the start time, or the time left in the period
      let timeRemaining = [];
      if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
        let timeLeft = data.liveData.linescore.currentPeriodTimeRemaining;
        timeLeft = timeLeft.replace(/^0/,'');
        timeRemaining = (
            <div className="timeRemaining">
              <h1>{timeLeft}</h1>
              { ((gameState === 'inprogress') || (gameState === 'inprogress-critical') || ((ordinalPeriod === 'OT' || ordinalPeriod === 'SO') && gameState === 'final')) &&
                <h1>{ordinalPeriod}</h1>
              }
            </div>
        );
      }else{
        timeRemaining = (
            <div className="timeRemaining">
              <h1><Moment format="h:mm A">{gameTime}</Moment></h1>
            </div>
        );
      }

      let homePPLogoBadge = homeTeamOnPP ? (
        <div className="logoPPBadge">
          <span>PP</span>
        </div>
      ) : ('');

      let awayPPLogoBadge = awayTeamOnPP ? (
        <div className="logoPPBadge">
          <span>PP</span>
        </div>
      ) : ('');

      // text color changes once the game ends
      let homeTextStyle = {color:'#262626'};
      let awayTextStyle = {color:'#262626'};
      if (gameState === 'final') {
        homeTextStyle = (homeScore < awayScore) ? ({color:'#959595'}) : {color:'black'};
        awayTextStyle = (awayScore < homeScore) ? ({color:'#959595'}) : {color:'black'};
      }

      let teamsAndScore = (
        <div className={"teamsAndScore"}>
          <div className={"teamInfo"}>
            <div className="homeLogo">
              <img src={resources[data.gameData.teams.home.id].logo} alt={homeName}/>
            </div>
            <h2 style={homeTextStyle}>{homeTriCode}</h2>
            {homePPLogoBadge}
            <h2 style={homeTextStyle}>{homeScore}</h2>
          </div>
          <div className="teamInfo">
            <div className="awayLogo">
              <img src={resources[data.gameData.teams.away.id].logo} alt={awayName}/>
            </div>
            <h2 style={awayTextStyle}>{awayTriCode}</h2>
            {awayPPLogoBadge}
            <h2 style={awayTextStyle}>{awayScore}</h2>
          </div>
        </div>
      )

      return({
        timeRemaining: timeRemaining,
        currentTeamsAndScore: teamsAndScore,
        timeStamp: currentTimeStamp,
        homePPBadge: homePPLogoBadge,
        awayPPBadge: awayPPLogoBadge
      })
    }
  }

  sideBarGameClick() {
    this.props.sideClick(this.props.data.gameData.game.pk);
  }

  render() {
    let data = this.refreshGame();
    let gameState = this.props.data.gameData.status.detailedState;
    gameState = gameState.toLowerCase().replace(/\s/g, '');
    let gameID = this.props.data.gameData.game.pk;
    let activeClass = (this.props.activeID === gameID) ? 'active' : ''; // active game gets a red bar (<span> element) beside to signify

    return (
      <div className={"sideBarGame gameDiv " + gameState + ' ' + activeClass} key={gameID} onClick={this.sideBarGameClick}>
        {activeClass === 'active' &&
          <span></span>
        }
        {data.currentTeamsAndScore}
        {data.timeRemaining}
      </div>
    )
  }

}
