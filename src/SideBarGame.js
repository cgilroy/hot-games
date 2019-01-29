import React, { Component } from 'react';
import { ScoringTable } from './ScoringTable.js';
import { LatestPlays } from './LatestPlays.js';
import { BoxScoreStateless } from './BoxScoreStateless.js';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class SideBarGame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: [],
      currentTeamsAndScore: [],
      scoringTable:[],
      currentPlays:[],
      awayBoxData:[],
      homeBoxData:[],
      timeStamp:'',
      homePPBadge:'',
      awayPPBadge:'',
      // activeBoxData:[],
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
          let powerPlayStrength = data.liveData.linescore.powerPlayStrength;
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



            let latestPlaysTable = (
              <LatestPlays currentPlay={data.liveData.plays.currentPlay} plays={data.liveData.plays.allPlays}/>
            );

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

            let teamsAndScore = (
              <div className={"teamsAndScore"}>
                <div className={"teamInfo"}>
                  <div className="homeLogo">
                    <img src={getLogoPath(homeName)} alt={homeName}/>
                  </div>
                  <h2>{homeTriCode}</h2>
                  {homePPLogoBadge}
                  <h2>{homeScore}</h2>
                </div>
                <div className="teamInfo">
                  <div className="awayLogo">
                    <img src={getLogoPath(awayName)} alt={awayName}/>
                  </div>
                  <h2>{awayTriCode}</h2>
                  {awayPPLogoBadge}
                  <h2>{awayScore}</h2>
                </div>
              </div>
            )

            // console.log('awayPP',awayPPLogoBadge);

            this.setState({
              timeRemaining: timeRemaining,
              currentTeamsAndScore: teamsAndScore,
              currentPlays: latestPlaysTable,
              timeStamp: currentTimeStamp,
              homePPBadge: homePPLogoBadge,
              awayPPBadge: awayPPLogoBadge
              // activeBoxScore: activeBoxScore
            })
          // }

      }
    }

  componentDidMount() {
    // console.log('mountGame');
      let gameState = this.props.data.gameData.status.detailedState;
      gameState = gameState.toLowerCase().replace(/\s/g, '');
      if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
        console.log('firstRefresh');
        this.refreshGame();
      }else {
        // game has not started yet



      };
      this.refreshGame();
  }

  componentWillUpdate(nextProps) {
    let gameState = nextProps.data.gameData.status.detailedState;
    gameState = gameState.toLowerCase().replace(/\s/g, '');
    if ((gameState === "inprogress-critical") || (gameState === "inprogress")) {
      // console.log('refreshUpdate');
      this.refreshGame();
    }
  }

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

  toggleExpandedGame() {
    this.setState({expanded: !this.state.expanded});
  }

  wasClicked() {
    this.props.sideClick(this.props.data.gameData.game.pk);
  }

  render() {
    let gameState = this.props.data.gameData.status.detailedState;
    gameState = gameState.toLowerCase().replace(/\s/g, '');
    let gameID = this.props.data.gameData.game.pk;
    console.log('renderGame');
    let boxData = (this.state.activeBoxTeam === 'home') ? (
      this.state.homeBoxData
    ) : (
      this.state.awayBoxData
    );

    // let divHeight = (this.state.expanded) ? {height:'auto'} : {height:'auto'};

    let awayPPBadge = '';
    let homePPBadge = '';
    if (gameState !== 'final') {
      let awayPPBadge = this.state.awayPPBadge;
      let homePPBadge = this.state.homePPBadge;
    }

    let activeClass = (this.props.activeID === gameID) ? 'active' : '';

    let expandedChar = (this.state.expanded) ? (<FontAwesomeIcon icon="chevron-up"/>) : <FontAwesomeIcon icon='chevron-down'/>;
    // console.log('boxData to render',boxData);
    // console.log('currentactiveteam',this.state.activeBoxTeam)
    return (
      <div className={"sideBarGame gameDiv " + gameState + ' ' + activeClass} key={gameID} onClick={this.wasClicked}>
        {this.state.currentTeamsAndScore}
        {this.state.timeRemaining}
      </div>
    )
  }

}

function getLogoPath(teamName) {
  var imagePath: string;
  switch (teamName) {
    case 'Anaheim Ducks':
      imagePath = '/resources/NHL-Icons-ANA.jpg';
      break;
    case 'Boston Bruins':
      imagePath = '/resources/NHL-Icons-BOS.jpg';
      break;
    case 'Buffalo Sabres':
      imagePath = '/resources/NHL-Icons-BUF.jpg';
      break;
    case 'Calgary Flames':
      imagePath = '/resources/NHL-Icons-CAL.jpg';
      break;
    case 'Carolina Hurricanes':
    imagePath = '/resources/NHL-Icons-CAR.jpg';
    break;
    case 'Chicago Blackhawks':
    imagePath = '/resources/NHL-Icons-CHI.jpg';
    break;
    case 'Colorado Avalanche':
    imagePath = '/resources/NHL-Icons-COL.jpg';
    break;
    case 'Columbus Blue Jackets':
    imagePath = '/resources/NHL-Icons-COL1.jpg';
    break;
    case 'Dallas Stars':
    imagePath = '/resources/NHL-Icons-DAL.jpg';
    break;
    case 'Detroit Red Wings':
    imagePath = '/resources/NHL-Icons-DET.jpg';
    break;
    case 'Edmonton Oilers':
    imagePath = '/resources/NHL-Icons-EDM.jpg';
    break;
    case 'Florida Panthers':
      imagePath = '/resources/NHL-Icons-FLO.jpg';
      break;
    case 'Los Angeles Kings':
    imagePath = '/resources/NHL-Icons-LAK.jpg';
    break;
    case 'Minnesota Wild':
    imagePath = '/resources/NHL-Icons-MIN.jpg';
    break;
    case 'Montréal Canadiens':
    imagePath = '/resources/NHL-Icons-MTL.jpg';
    break;
    case 'Nashville Predators':
    imagePath = '/resources/NHL-Icons-NAS.jpg';
    break;
    case 'New Jersey Devils':
    imagePath = '/resources/NHL-Icons-NJD.jpg';
    break;
    case 'New York Islanders':
      imagePath = '/resources/NHL-Icons-NYI.jpg';
      break;
    case 'New York Rangers':
      imagePath = '/resources/NHL-Icons-NYR.jpg';
      break;
    case 'Ottawa Senators':
    imagePath = '/resources/NHL-Icons-OTT.jpg';
    break;
    case 'Philadelphia Flyers':
    imagePath = '/resources/NHL-Icons-PHI.jpg';
    break;
    case 'Arizona Coyotes':
    imagePath = '/resources/NHL-Icons-PHO.jpg';
    break;
    case 'Pittsburgh Penguins':
    imagePath = '/resources/NHL-Icons-PIT.jpg';
    break;
    case 'San Jose Sharks':
    imagePath = '/resources/NHL-Icons-SJ.jpg';
    break;
    case 'St. Louis Blues':
      imagePath = '/resources/NHL-Icons-SL.jpg';
      break;
    case 'Tampa Bay Lightning':
    imagePath = '/resources/NHL-Icons-TAM.jpg';
    break;
    case 'Toronto Maple Leafs':
      imagePath = '/resources/NHL-Icons-TOR.jpg';
      break;
    case 'Vancouver Canucks':
    imagePath = '/resources/NHL-Icons-VAN.jpg';
    break;
    case 'Vegas Golden Knights':
    imagePath = '/resources/NHL-Icons-VGS.jpg';
    break;
    case 'Winnipeg Jets':
    imagePath = '/resources/NHL-Icons-WIN.jpg';
    break;
    case 'Washington Capitals':
      imagePath = '/resources/NHL-Icons-WAS.jpg';
      break;
    default:

  }
  return imagePath;
}
