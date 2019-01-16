import React, { Component } from 'react';
import { ScoringTable } from './ScoringTable.js';
import { LatestPlays } from './LatestPlays.js';
import { BoxScoreStateless } from './BoxScoreStateless.js';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class APIActiveGameFetch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeAndScore: [],
      scoringTable:[],
      currentPlays:[],
      awayBoxData:[],
      homeBoxData:[],
      timeStamp:'',
      homePPBadge:'',
      awayPPBadge:'',
      // activeBoxData:[],
      activeBoxTeam:'home',
      expanded: false,
      gameBanner:[]
    }
    this.refreshGame = this.refreshGame.bind(this);
    // this.toggleExpandedGame = this.toggleExpandedGame.bind(this);
    // this.buttonClick = this.buttonClick.bind(this);
  }
  refreshGame() {
    let apiString = 'https://statsapi.web.nhl.com//api/v1/game/' + this.props.gameID + '/feed/live';
    console.log('apiString',apiString);
    fetch(apiString)
      .then(results => {
        return results.json();
      }).then(data => {
        // console.log('data.liveData',data.liveData);
        if ((data.liveData !== undefined) && (data.metaData.timeStamp !== this.state.timeStamp)) {
          let timeLeft = data.liveData.linescore.currentPeriodTimeRemaining;
          timeLeft = timeLeft.replace(/^0/,'');
          let ordinalPeriod = data.liveData.linescore.currentPeriodOrdinal;
          let homeScore = "";
          let awayScore = "";
          let gameState = data.gameData.status.detailedState;
          gameState = gameState.toLowerCase().replace(/\s/g, '');
          if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
            homeScore = data.liveData.linescore.teams.home.goals;
            awayScore = data.liveData.linescore.teams.away.goals;
          };
          let currentTimeStamp = data.metaData.timeStamp;
          let homeTeamOnPP = data.liveData.linescore.teams.home.powerPlay;
          let awayTeamOnPP = data.liveData.linescore.teams.away.powerPlay;
          let powerPlayStrength = data.liveData.linescore.powerPlayStrength;
          let homeName = data.gameData.teams.home.teamName;
          let awayName = data.gameData.teams.away.teamName;
          // if (currentTimeStamp !== this.state.timeStamp) {
            // console.log('firstRefreshIn')
            // if ((this.props.gameState === "inprogress-critical") || (this.props.gameState === "inprogress") || (this.props.gameState === "final")) {
            //
            // }
            let gameBanner = (
              <MainGameBanner
                homeScore={homeScore}
                awayScore={awayScore}
                homeName={homeName}
                awayName={awayName}
                />
            );

            let scoringTable = (
              <ScoringTable plays={data.liveData.plays}/>
            );

            let latestPlaysTable = (
              <LatestPlays currentPlay={data.liveData.plays.currentPlay} plays={data.liveData.plays.allPlays}/>
            );

            let homeBoxData = data.liveData.boxscore.teams.home;
            let awayBoxData = data.liveData.boxscore.teams.away;

            let homePPLogoBadge = homeTeamOnPP ? (
              <div className="logoPPBadge">
                <h4>{powerPlayStrength}</h4>
              </div>
            ) : ('');

            let awayPPLogoBadge = awayTeamOnPP ? (
              <div className="logoPPBadge">
                <h4>{powerPlayStrength}</h4>
              </div>
            ) : ('');

            // console.log('awayPP',awayPPLogoBadge);

            this.setState({
              scoringTable: scoringTable,
              currentPlays: latestPlaysTable,
              homeBoxData: homeBoxData,
              awayBoxData: awayBoxData,
              timeStamp: currentTimeStamp,
              homePPBadge: homePPLogoBadge,
              awayPPBadge: awayPPLogoBadge,
              gameBanner: gameBanner
              // activeBoxScore: activeBoxScore
            })
          // }

      }
      })
  }

  componentDidMount() {
      this.refreshGame();
  }

  componentWillUpdate(nextProps) {
    if ((nextProps.gameState === "inprogress-critical") || (nextProps.gameState === "inprogress")) {
      // console.log('refreshUpdate');
      this.refreshGame();
    }
    this.refreshGame();
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

  // toggleExpandedGame() {
  //   this.setState({expanded: !this.state.expanded});
  // }

  render() {
    console.log('renderGame');
    let boxData = (this.state.activeBoxTeam === 'home') ? (
      this.state.homeBoxData
    ) : (
      this.state.awayBoxData
    );

    // let divHeight = (this.state.expanded) ? {height:'auto'} : {height:'auto'};

    let awayPPBadge = '';
    let homePPBadge = '';
    if (this.props.gameState !== 'final') {
      let awayPPBadge = this.state.awayPPBadge;
      let homePPBadge = this.state.homePPBadge;
    }

    let expandedChar = (this.state.expanded) ? (<FontAwesomeIcon icon="chevron-up"/>) : <FontAwesomeIcon icon='chevron-down'/>;
    // console.log('boxData to render',boxData);
    // console.log('currentactiveteam',this.state.activeBoxTeam)
    return (
      <div className={"liveData"}>
        {this.state.gameBanner}
        <div className="top">
          <div className="top-left">
            <div className="teamNames">
              <div className="homeLogo">
                <img src={getLogoPath(this.props.homeName)} alt={this.props.homeName}/>
                {this.state.homePPBadge}
              </div>
              <h3>vs</h3>
              <div className="awayLogo">
                <img src={getLogoPath(this.props.awayName)} alt={this.props.awayName}/>
                {this.state.awayPPBadge}
              </div>
            </div>
            {this.state.timeAndScore}
            {this.state.scoringTable}
          </div>
          <div className="top-right">
            {this.state.currentPlays}
          </div>
        </div>
        <div className="dataToggleButton" onClick={this.toggleExpandedGame}>
          <h2>{expandedChar}</h2>
        </div>
        <div className="bottom">

          <div className="bottomData">
            <div className="buttonRow">
              <button className={this.state.activeBoxTeam === 'home' ? 'active' : ''} onClick={()=>this.handleClick('home')}>{this.props.homeName}</button>
              <button className={this.state.activeBoxTeam === 'away' ? 'active' : ''} onClick={()=>this.handleClick('away')}>{this.props.awayName}</button>
            </div>
            <BoxScoreStateless playerData={boxData}/>
          </div>

        </div>
      </div>


    )
  }

}

function MainGameBanner(props) {
  console.log(props);
  return (
    <div className="bannerContainer">

      <h1>{props.homeScore}</h1>
    </div>
  )
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
