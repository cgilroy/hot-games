import React, { Component } from 'react';
import { ScoringTable } from './ScoringTable.js';
import { LatestPlays } from './LatestPlays.js';
import { BoxScoreStateless } from './BoxScoreStateless.js';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './ActiveGameArea.css';
import TestLiveData from './json-test-livegame.json';
import TestFinalData from './json-test-endedgame.json';
// import ScheduledBG from '/resources/ice-bg.jpg';

export class ActiveGameArea extends Component {

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
      gameBanner:[],
      currentGameID:"",
      gameState:"",
      resources: {
        home:[],
        away:[]
      },
      media: {
        gameRecap:[],
        gamePreview:[]
      }
    }
    this.refreshGame = this.refreshGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // this.toggleExpandedGame = this.toggleExpandedGame.bind(this);
    // this.buttonClick = this.buttonClick.bind(this);
  }
  refreshGame(gameData, contentData) {
      let data = gameData;
      // data = TestLiveData;
      // data = TestFinalData;
        // console.log('data.liveData',data.liveData);
        if ((data !== undefined)
          && ((data.metaData.timeStamp !== this.state.timeStamp) || ((data.gameData.game.pk !== this.state.currentGameID)))) {
          let gameID = data.gameData.game.pk;
          let gameDate = data.gameData.datetime.dateTime;
          let timeLeft = "";
          let ordinalPeriod = "";
          let homeTeamOnPP = "";
          let awayTeamOnPP = "";
          let powerPlayStrength = "";
          let homeScore = "";
          let awayScore = "";
          let gameState = data.gameData.status.detailedState;
          gameState = gameState.toLowerCase().replace(/\s/g, '');
          if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
            timeLeft = data.liveData.linescore.currentPeriodTimeRemaining;
            timeLeft = timeLeft.replace(/^0/,'');
            ordinalPeriod = data.liveData.linescore.currentPeriodOrdinal;
            homeTeamOnPP = data.liveData.linescore.teams.home.powerPlay;
            awayTeamOnPP = data.liveData.linescore.teams.away.powerPlay;
            powerPlayStrength = data.liveData.linescore.powerPlayStrength;
            homeScore = data.liveData.linescore.teams.home.goals;
            awayScore = data.liveData.linescore.teams.away.goals;
          }
          let currentTimeStamp = data.metaData.timeStamp;
          let homeTeamName = data.gameData.teams.home.teamName;
          let homeCityName = data.gameData.teams.home.locationName;
          let awayTeamName = data.gameData.teams.away.teamName;
          let awayCityName = data.gameData.teams.away.locationName;
          let homeResources = getTeamResources(data.gameData.teams.home.name);
          let awayResources = getTeamResources(data.gameData.teams.away.name);
          let venue = {
            name: data.gameData.teams.home.venue.name,
            city: data.gameData.teams.home.venue.city
          }
          let homeTricode = data.gameData.teams.home.abbreviation;
          let awayTricode = data.gameData.teams.away.abbreviation;
          // if (currentTimeStamp !== this.state.timeStamp) {
            // console.log('firstRefreshIn')
            // if ((this.props.gameState === "inprogress-critical") || (this.props.gameState === "inprogress") || (this.props.gameState === "final")) {
            //
            // }

            let timeAndScore = (
              <TimeAndScore
                gameState={gameState}
                timeLeft={timeLeft}
                homeScore={homeScore}
                awayScore={awayScore}
                gameDate={gameDate}
                periodData={data.liveData.linescore}
                currentPeriodOrdinal={ordinalPeriod}
                homeColor={homeResources.primaryColor}
                awayColor={awayResources.primaryColor}
                venue={venue}
                homeTricode={homeTricode}
                awayTricode={awayTricode}
                />
            );
            let gameBanner = (
              <MainGameBanner
                timeAndScore={timeAndScore}
                homeTeamName={homeTeamName}
                awayTeamName={awayTeamName}
                homeCityName={homeCityName}
                awayCityName={awayCityName}
                />
            );

            let scoringTable = '';
            if (gameState.search('progress') !== -1 || gameState === 'final') {
              scoringTable = (
                <ScoringTable
                  plays={data.liveData.plays}
                  homeTricode={homeTricode}
                  awayTricode={awayTricode}
                  homeResources={homeResources}
                  awayResources={awayResources}
                />
              );
            }

            let gameRecap ='';
            if (gameState.search('final') !== -1) {
              gameRecap = (contentData.editorial.recap.items.length !== 0) ? (
                <GameRecap
                  content={contentData}
                />
              ) : (
                ''
              )
            }

            let gamePreview = '';
            if (gameState.search('schedule') !== -1 || gameState.search('pre') !== -1) {
              gamePreview = (contentData.editorial.preview.items.length !== 0) ? (
                <GamePreview
                  content={contentData}
                />
              ) : (
                <div className="noMediaContent">
                  <h1>No Preview Available</h1>
                </div>
              )
            }

            let latestPlaysTable = '';
            if (gameState.search('progress') !== -1) {
              latestPlaysTable = (
                <LatestPlays
                  homeTricode={homeTricode}
                  awayTricode={awayTricode}
                  homeResources={homeResources}
                  awayResources={awayResources}
                  currentPlay={data.liveData.plays.currentPlay}
                  plays={data.liveData.plays.allPlays}
                  gamePk={gameID}
                />
              );
            }

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
              gameBanner: gameBanner,
              currentGameID: gameID,
              gameState: gameState,
              resources: {
                home:homeResources,
                away:awayResources
              },
              media: {
                gameRecap:gameRecap,
                gamePreview:gamePreview
              }
              // activeBoxScore: activeBoxScore
            })
          // }

      }
  }

  componentDidMount() {
      this.refreshGame(this.props.data, this.props.content);
  }

  componentWillUpdate(nextProps) {
    // if ((nextProps.gameState === "inprogress-critical") || (nextProps.gameState === "inprogress")) {
    //   // console.log('refreshUpdate');
    //   this.refreshGame();
    // }
    if (nextProps.data !== undefined) {
      this.refreshGame(nextProps.data,nextProps.content);
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


    let homeTeamName = this.props.data.gameData.teams.home.teamName;
    let homeCityName = this.props.data.gameData.teams.home.locationName;
    let awayTeamName = this.props.data.gameData.teams.away.teamName;
    let awayCityName = this.props.data.gameData.teams.away.locationName;

    let boxScore = '';
    if (this.state.gameState === 'final' || this.state.gameState.search('progress') !== -1) {
      boxScore = (
        <BoxScoreStateless
          playerData={boxData}
          homeResources={this.state.resources.home}
          awayResources={this.state.resources.away}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          activeBoxTeam={this.state.activeBoxTeam}
          onClick={this.handleClick}
        />
      )
    }
    // let divHeight = (this.state.expanded) ? {height:'auto'} : {height:'auto'};

    let awayPPBadge = '';
    let homePPBadge = '';
    if (this.state.gameState !== 'final') {
      let awayPPBadge = this.state.awayPPBadge;
      let homePPBadge = this.state.homePPBadge;
    }

    // let expandedChar = (this.state.expanded) ? (<FontAwesomeIcon icon="chevron-up"/>) : <FontAwesomeIcon icon='chevron-down'/>;
    // console.log('boxData to render',boxData);
    // console.log('currentactiveteam',this.state.activeBoxTeam)
    return (
      <div className={"liveData"}>
        {this.state.gameBanner}
        {this.state.media.gameRecap}
        {this.state.media.gamePreview}
        <div className="top">

          <div className="top-left">
            {this.state.currentPlays}
            {this.state.scoringTable}
          </div>
          <div className="top-right">
            {boxScore}
          </div>
        </div>
        <div className="bottom">

          <div className="bottomData">

          </div>

        </div>
      </div>


    )
  }

}

function GameRecap(props) {
  let item = props.content.editorial.recap.items[0];
  let headline = item.headline;
  let subhead = item.subhead;
  let imgSrc = item.media.image.cuts['1136x640'].src;
  let description = item.preview;
  return (
    <div className="gameRecap">
      <div className="blurb">
        <h1>{headline}</h1>
        <h2>{subhead}</h2>
      </div>

        <img src={imgSrc} style={{width:'100%'}}/>
        <div className="description" dangerouslySetInnerHTML={{__html:description}}></div>
    </div>
  )
}

function GamePreview(props) {
  let item = props.content.editorial.preview.items[0];
  let headline = item.headline;
  let subhead = item.subhead;
  let imgSrc = item.media.image.cuts['1136x640'].src;
  let description = item.preview;
  return (
    <div className="gamePreview">
      <div className="heroImage">
        <img src={imgSrc}/>
        <div className="description" dangerouslySetInnerHTML={{__html:description}}></div>
      </div>


    </div>
  )
}

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
        <h2>{props.homeScore}</h2>
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
        <h2>{props.awayScore}</h2>
      </div>
    )
  }


}

function BannerPeriodTable(props) {
  let data = props.periodData.periods;
  let homeData = [];
  let awayData = [];

  for (let i = 0; i < 3; i++) {
    if (data[i] !== undefined) {
      let homeValue = data[i].home.goals;
      let homeStyle = (homeValue === 0) ? ({color: '#959595'}) : {};
      homeData.push(<td style={homeStyle}>{homeValue}</td>);
      let awayValue = data[i].away.goals;
      let awayStyle = (awayValue === 0) ? ({color: '#959595'}) : {};
      awayData.push(<td style={awayStyle}>{awayValue}</td>);
    } else {
      homeData.push(<td style={{color:'#959595'}}>-</td>);
      awayData.push(<td style={{color:'#959595'}}>-</td>)
    }
  }
  let overtimeGame = false;
  if (data.length > 3) {
    overtimeGame = true;
    let homeValue = data[data.length-1].home.goals;
    let homeStyle = (homeValue === 0) ? ({color: '#959595'}) : {};
    homeData.push(<td style={homeStyle}>{homeValue}</td>);
    let awayValue = data[data.length-1].away.goals;
    let awayStyle = (awayValue === 0) ? ({color: '#959595'}) : {};
    awayData.push(<td style={awayStyle}>{awayValue}</td>);
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

function MainGameBanner(props) {
  console.log(props);
  let homeTeamResources = getTeamResources(props.homeCityName+" "+props.homeTeamName);
  let awayTeamResources = getTeamResources(props.awayCityName+" "+props.awayTeamName);
  return (
    <div className="bannerContainer">
      <div className="bannerGroup home" style={{background: homeTeamResources.primaryColor}}>
        <h1>{props.homeTeamName}</h1>
        <img src={homeTeamResources.imagePath} />
      </div>
      {props.timeAndScore}
      <div className="bannerGroup away" style={{background: awayTeamResources.primaryColor}}>
        <img src={awayTeamResources.imagePath} />
        <h1>{props.awayTeamName}</h1>
      </div>
    </div>
  )
}

function getTeamResources(teamName) {
  var imagePath: string;
  var primaryColor: string;
  switch (teamName) {
    case 'Anaheim Ducks':
      imagePath = '/resources/NHL-Icons-ANA.jpg';
      primaryColor = '#B09862';
      break;
    case 'Arizona Coyotes':
    imagePath = '/resources/NHL-Icons-PHO.jpg';
    primaryColor = '#8C2633';
      break;
    case 'Boston Bruins':
      imagePath = '/resources/NHL-Icons-BOS.jpg';
      primaryColor = '#FFB81C';
      break;
    case 'Buffalo Sabres':
      imagePath = '/resources/NHL-Icons-BUF.jpg';
      primaryColor = '#002654';
      break;
    case 'Calgary Flames':
      imagePath = '/resources/NHL-Icons-CAL.jpg';
      primaryColor = '#C8102E';
      break;
    case 'Carolina Hurricanes':
    imagePath = '/resources/NHL-Icons-CAR.jpg';
    primaryColor = '#CC0000';
    break;
    case 'Chicago Blackhawks':
    imagePath = '/resources/NHL-Icons-CHI.jpg';
    primaryColor = '#CF0A2C';
    break;
    case 'Colorado Avalanche':
    imagePath = '/resources/NHL-Icons-COL.jpg';
    primaryColor = '#6F263D';
    break;
    case 'Columbus Blue Jackets':
    imagePath = '/resources/NHL-Icons-COL1.jpg';
    primaryColor = '#002654';
    break;
    case 'Dallas Stars':
    imagePath = '/resources/NHL-Icons-DAL.jpg';
    primaryColor = '#006847';
    break;
    case 'Detroit Red Wings':
    imagePath = '/resources/NHL-Icons-DET.jpg';
    primaryColor = '#CE1126';
    break;
    case 'Edmonton Oilers':
    imagePath = '/resources/NHL-Icons-EDM.jpg';
    primaryColor = '#041E42';
    break;
    case 'Florida Panthers':
      imagePath = '/resources/NHL-Icons-FLO.jpg';
      primaryColor = '#041E42';
      break;
    case 'Los Angeles Kings':
    imagePath = '/resources/NHL-Icons-LAK.jpg';
    primaryColor = '#111111';
    break;
    case 'Minnesota Wild':
    imagePath = '/resources/NHL-Icons-MIN.jpg';
    primaryColor = '#154734';
    break;
    case 'Montréal Canadiens':
    imagePath = '/resources/NHL-Icons-MTL.jpg';
    primaryColor = '#AF1E2D';
    break;
    case 'Nashville Predators':
    imagePath = '/resources/NHL-Icons-NAS.jpg';
    primaryColor = '#FFB81C';
    break;
    case 'New Jersey Devils':
    imagePath = '/resources/NHL-Icons-NJD.jpg';
    primaryColor = '#CE1126';
    break;
    case 'New York Islanders':
      imagePath = '/resources/NHL-Icons-NYI.jpg';
      primaryColor = '#00539B';
      break;
    case 'New York Rangers':
      imagePath = '/resources/NHL-Icons-NYR.jpg';
      primaryColor = '#0038A8';
      break;
    case 'Ottawa Senators':
    imagePath = '/resources/NHL-Icons-OTT.jpg';
    primaryColor = '#E31837';
    break;
    case 'Philadelphia Flyers':
    imagePath = '/resources/NHL-Icons-PHI.jpg';
    primaryColor = '#F74902';
    break;
    case 'Pittsburgh Penguins':
    imagePath = '/resources/NHL-Icons-PIT.jpg';
    primaryColor = '#FCB514';
    break;
    case 'San Jose Sharks':
    imagePath = '/resources/NHL-Icons-SJ.jpg';
    primaryColor = '#006D75';
    break;
    case 'St. Louis Blues':
      imagePath = '/resources/NHL-Icons-SL.jpg';
      primaryColor = '#002F87';
      break;
    case 'Tampa Bay Lightning':
    imagePath = '/resources/NHL-Icons-TAM.jpg';
    primaryColor = '#002868';
    break;
    case 'Toronto Maple Leafs':
      imagePath = '/resources/NHL-Icons-TOR.jpg';
      primaryColor = '#003E7E';
      break;
    case 'Vancouver Canucks':
    imagePath = '/resources/NHL-Icons-VAN.jpg';
    primaryColor = '#001F5B';
    break;
    case 'Vegas Golden Knights':
    imagePath = '/resources/NHL-Icons-VGS.jpg';
    primaryColor = '#B4975A';
    break;
    case 'Winnipeg Jets':
    imagePath = '/resources/NHL-Icons-WIN.jpg';
    primaryColor = '#041E42';
    break;
    case 'Washington Capitals':
      imagePath = '/resources/NHL-Icons-WAS.jpg';
      primaryColor = '#C8102E';
    break;
    default:
      primaryColor: '#ff0000';

  }
  return {imagePath,primaryColor}
}
