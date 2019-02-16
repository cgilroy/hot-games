import React, { Component } from 'react';
import Moment from 'react-moment';
import resources from './TeamResources.js';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    this.wasClicked = this.wasClicked.bind(this);
    // this.buttonClick = this.buttonClick.bind(this);
  }
  refreshGame() {
        let data = this.props.data;
        // console.log('data.liveData',data.liveData);
        if ((data.liveData !== undefined) && (data.metaData.timeStamp !== this.state.timeStamp)) {
          let gameState = data.gameData.status.detailedState;
          gameState = gameState.toLowerCase().replace(/\s/g, '');
          let gameTime = data.gameData.datetime.dateTime;
          let homeName = data.gameData.teams.home.name;
          let awayName = data.gameData.teams.away.name;
          //timeLeft = isNaN(timeLeft.charAt(0)) ? timeLeft : timeLeft.replace(/^0/,'');
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
          // let powerPlayStrength = data.liveData.linescore.powerPlayStrength;
          let homeTriCode = data.gameData.teams.home.abbreviation;
          let awayTriCode = data.gameData.teams.away.abbreviation;

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
              // let msec = Date.parse(gameTime);
              // let gameTime = new Date(msec);

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
            let homeTextStyle = {color:'black'};
            let awayTextStyle = {color:'black'};
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

            // console.log('awayPP',awayPPLogoBadge);
            return({
              timeRemaining: timeRemaining,
              currentTeamsAndScore: teamsAndScore,
              timeStamp: currentTimeStamp,
              homePPBadge: homePPLogoBadge,
              awayPPBadge: awayPPLogoBadge
            })

            // this.setState({
            //
            //   // activeBoxScore: activeBoxScore
            // })
          // }

      }
    }

  // componentDidMount() {
  //   // console.log('mountGame');
  //     let gameState = this.props.data.gameData.status.detailedState;
  //     gameState = gameState.toLowerCase().replace(/\s/g, '');
  //     if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
  //       console.log('firstRefresh');
  //       this.refreshGame();
  //     }else {
  //       // game has not started yet
  //
  //
  //
  //     };
  //     this.refreshGame();
  // }

  // componentWillUpdate(nextProps) {
  //   let gameState = nextProps.data.gameData.status.detailedState;
  //   gameState = gameState.toLowerCase().replace(/\s/g, '');
  //   if ((gameState === "inprogress-critical") || (gameState === "inprogress")) {
  //     // console.log('refreshUpdate');
  //     this.refreshGame();
  //   }
  // }

  handleClick(team) {
    console.log('clickclickclick');
    // let boxData = this.state.activeBoxData;
    if(team === 'home'){
      // console.log('switching to home');
      this.setState({activeBoxTeam:team});
    }else{
      // console.log('switching to away');
      this.setState({activeBoxTeam:team});
    }

  }

  componentDidUpdate() {
    console.log('gamecomponentupdate');
    // this.props.toggleHandler();
  }

  wasClicked() {
    this.props.sideClick(this.props.data.gameData.game.pk);
  }

  render() {
    let data = this.refreshGame();
    let gameState = this.props.data.gameData.status.detailedState;
    gameState = gameState.toLowerCase().replace(/\s/g, '');
    let gameID = this.props.data.gameData.game.pk;
    console.log('renderGame');

    // let divHeight = (this.state.expanded) ? {height:'auto'} : {height:'auto'};


    let activeClass = (this.props.activeID === gameID) ? 'active' : '';
    // console.log('boxData to render',boxData);
    // console.log('currentactiveteam',this.state.activeBoxTeam)
    return (
      <div className={"sideBarGame gameDiv " + gameState + ' ' + activeClass} key={gameID} onClick={this.wasClicked}>
        {activeClass === 'active' &&
          <span></span>
        }
        {data.currentTeamsAndScore}
        {data.timeRemaining}
      </div>
    )
  }

}

function getLogoPath(teamName) {
  var imagePath: string;
  switch (teamName) {
    case 'Anaheim Ducks':
      imagePath = '/resources/NHL-Icons-ANA.svg';
      break;
    case 'Boston Bruins':
      imagePath = '/resources/NHL-Icons-BOS.svg';
      break;
    case 'Buffalo Sabres':
      imagePath = '/resources/NHL-Icons-BUF.svg';
      break;
    case 'Calgary Flames':
      imagePath = '/resources/NHL-Icons-CAL.svg';
      break;
    case 'Carolina Hurricanes':
    imagePath = '/resources/NHL-Icons-CAR.svg';
    break;
    case 'Chicago Blackhawks':
    imagePath = '/resources/NHL-Icons-CHI.svg';
    break;
    case 'Colorado Avalanche':
    imagePath = '/resources/NHL-Icons-COL.svg';
    break;
    case 'Columbus Blue Jackets':
    imagePath = '/resources/NHL-Icons-COL1.svg';
    break;
    case 'Dallas Stars':
    imagePath = '/resources/NHL-Icons-DAL.svg';
    break;
    case 'Detroit Red Wings':
    imagePath = '/resources/NHL-Icons-DET.svg';
    break;
    case 'Edmonton Oilers':
    imagePath = '/resources/NHL-Icons-EDM.svg';
    break;
    case 'Florida Panthers':
      imagePath = '/resources/NHL-Icons-FLO.svg';
      break;
    case 'Los Angeles Kings':
    imagePath = '/resources/NHL-Icons-LAK.svg';
    break;
    case 'Minnesota Wild':
    imagePath = '/resources/NHL-Icons-MIN.svg';
    break;
    case 'Montréal Canadiens':
    imagePath = '/resources/NHL-Icons-MTL.svg';
    break;
    case 'Nashville Predators':
    imagePath = '/resources/NHL-Icons-NAS.svg';
    break;
    case 'New Jersey Devils':
    imagePath = '/resources/NHL-Icons-NJD.svg';
    break;
    case 'New York Islanders':
      imagePath = '/resources/NHL-Icons-NYI.svg';
      break;
    case 'New York Rangers':
      imagePath = '/resources/NHL-Icons-NYR.svg';
      break;
    case 'Ottawa Senators':
    imagePath = '/resources/NHL-Icons-OTT.svg';
    break;
    case 'Philadelphia Flyers':
    imagePath = '/resources/NHL-Icons-PHI.svg';
    break;
    case 'Arizona Coyotes':
    imagePath = '/resources/NHL-Icons-PHO.svg';
    break;
    case 'Pittsburgh Penguins':
    imagePath = '/resources/NHL-Icons-PIT.svg';
    break;
    case 'San Jose Sharks':
    imagePath = '/resources/NHL-Icons-SJ.svg';
    break;
    case 'St. Louis Blues':
      imagePath = '/resources/NHL-Icons-SL.svg';
      break;
    case 'Tampa Bay Lightning':
    imagePath = '/resources/NHL-Icons-TAM.svg';
    break;
    case 'Toronto Maple Leafs':
      imagePath = '/resources/NHL-Icons-TOR.svg';
      break;
    case 'Vancouver Canucks':
    imagePath = '/resources/NHL-Icons-VAN.svg';
    break;
    case 'Vegas Golden Knights':
    imagePath = '/resources/NHL-Icons-VGS.svg';
    break;
    case 'Winnipeg Jets':
    imagePath = '/resources/NHL-Icons-WIN.svg';
    break;
    case 'Washington Capitals':
      imagePath = '/resources/NHL-Icons-WAS.svg';
      break;
    default:

  }
  return imagePath;
}
