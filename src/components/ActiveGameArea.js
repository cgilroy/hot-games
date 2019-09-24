import React, { Component } from 'react';
import { ScoringTable } from './ScoringTable.js';
import { PenaltyTable } from './PenaltyTable.js';
import { LatestPlays } from './LatestPlays.js';
import { BoxScore } from './BoxScore.js';
import { RinkMap } from './RinkMap.js';
import ThreeStars from './ThreeStars.js';
import GameRecap from './GameRecap.js';
import GamePreview from './GamePreview.js';
import TimeAndScore from './TimeAndScore.js';
import MainGameBanner from './MainGameBanner.js';
import '../css/ActiveGameArea.css';
import resources from './TeamResources';
import NHLShieldLogo from '../resources/NHL-Shield-Logo.svg';
import ChevronLeft from '../resources/chevron-left.svg';

export class ActiveGameArea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeBoxTeam:'home',
    }
    this.refreshGame = this.refreshGame.bind(this);
    this.recordArrayToStrings = this.recordArrayToStrings.bind(this);
    this.handleBoxScoreClick = this.handleBoxScoreClick.bind(this);
  }

  refreshGame(gameData, contentData) {
    // refresh all the components with the latest fetched game data
    let data = gameData;
    let gameID = data.gameData.game.pk;
    let gameDate = data.gameData.datetime.dateTime;
    let timeLeft = "";
    let ordinalPeriod = "";
    let ppData = {
      homeTeamOnPP: "",
      awayTeamOnPP: "",
      powerPlayStrength:""
    };
    let homeScore = "";
    let awayScore = "";

    // update variables specific to games in progress or over
    let gameState = data.gameData.status.detailedState;
    gameState = gameState.toLowerCase().replace(/\s/g, '');
    if ((gameState === "inprogress-critical") || (gameState === "inprogress") || (gameState === "final")) {
      timeLeft = data.liveData.linescore.currentPeriodTimeRemaining;
      timeLeft = timeLeft.replace(/^0/,'');
      ordinalPeriod = data.liveData.linescore.currentPeriodOrdinal;
      ppData = {
        homeTeamOnPP: data.liveData.linescore.teams.home.powerPlay,
        awayTeamOnPP: data.liveData.linescore.teams.away.powerPlay,
        powerPlayStrength: data.liveData.linescore.powerPlayStrength
      }
      homeScore = data.liveData.linescore.teams.home.goals;
      awayScore = data.liveData.linescore.teams.away.goals;
    }
    let currentTimeStamp = data.metaData.timeStamp; // update the current timestamp to the latest data timestamp
    let homeTeamName = data.gameData.teams.home.teamName;
    let homeCityName = data.gameData.teams.home.locationName;
    let awayTeamName = data.gameData.teams.away.teamName;
    let awayCityName = data.gameData.teams.away.locationName;
    let homeResources = resources[data.gameData.teams.home.id];
    let awayResources = resources[data.gameData.teams.away.id];
    let venue = {
      name: data.gameData.teams.home.venue.name,
      city: data.gameData.teams.home.venue.city
    }
    //teamname three letter abbreviations
    let homeTricode = data.gameData.teams.home.abbreviation;
    let awayTricode = data.gameData.teams.away.abbreviation;

    let homeBoxData = data.liveData.boxscore.teams.home;
    let awayBoxData = data.liveData.boxscore.teams.away;

    // update all components with the latest data
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
        gameState={gameState}
        timeAndScore={timeAndScore}
        homeTeamId={data.gameData.teams.home.id}
        awayTeamId={data.gameData.teams.away.id}
        homeTeamName={homeTeamName}
        awayTeamName={awayTeamName}
        records={this.recordArrayToStrings(this.props.records)}
        ppData={ppData}
        homeScore={homeScore}
        awayScore={awayScore}
        mobileActive={this.props.mobileActive}
        homeTricode={homeTricode}
        awayTricode={awayTricode}
        />
    );

    let scoringTable = '';
    let penaltyTable = '';
    let rinkMap='';
    if (gameState.search('progress') !== -1 || gameState === 'final') {
      scoringTable = (
        <ScoringTable
          plays={data.liveData.plays}
          homeTricode={homeTricode}
          awayTricode={awayTricode}
          homeResources={homeResources}
          awayResources={awayResources}
          hasShootout={data.liveData.linescore.hasShootout}
          playsByPeriod={data.liveData.plays.playsByPeriod}
          shootoutScore={data.liveData.linescore.shootoutInfo}
        />
      );
      penaltyTable = (
        <PenaltyTable
          plays={data.liveData.plays}
          homeTricode={homeTricode}
          awayTricode={awayTricode}
          homeResources={homeResources}
          awayResources={awayResources}
        />
      );
      rinkMap = (
        <RinkMap
        plays={data.liveData.plays}
        homeResources={homeResources}
        awayResources={awayResources}
        homeTricode={homeTricode}
        awayTricode={awayTricode}
        />
      )
    }

    let gameRecap ='';
    let threeStars ='';
    if (gameState.search('final') !== -1) {
      gameRecap = (contentData.editorial.recap.items.length !== 0) ? (
        <GameRecap
          content={contentData}
        />
      ) : (
        ''
      );
      threeStars = (data.liveData.decisions.firstStar !== undefined) ? (
        <ThreeStars
          firstStar={data.liveData.decisions.firstStar}
          secondStar={data.liveData.decisions.secondStar}
          thirdStar={data.liveData.decisions.thirdStar}
          homeSkaterData={homeBoxData.players}
          awaySkaterData={awayBoxData.players}
          homeResources={homeResources}
          awayResources={awayResources}
        />
      ) : ('')
    }

    let gamePreview = '';
    if (gameState.search('schedule') !== -1 || gameState.search('pre') !== -1) {
      try {
        gamePreview = (contentData.editorial.preview.items.length !== 0) ? (
          <GamePreview
            content={contentData}
          />
        ) : (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
            <div className='noMediaContent'>
              <img src={NHLShieldLogo} alt='NHL Logo'/>
              <h1>No Preview Available</h1>
            </div>
          </div>
        )
      } catch(error) {
        gamePreview = (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
            <div className='noMediaContent'>
              <img src={NHLShieldLogo} alt='NHL Logo'/>
              <h1>No Preview Available</h1>
            </div>
          </div>
        )
      }
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

    let homePPLogoBadge = ppData.homeTeamOnPP ? (
      <div className="logoPPBadge">
        <h4>{ppData.powerPlayStrength}</h4>
      </div>
    ) : ('');

    let awayPPLogoBadge = ppData.awayTeamOnPP ? (
      <div className="logoPPBadge">
        <h4>{ppData.powerPlayStrength}</h4>
      </div>
    ) : ('');

    return({
      scoringTable: scoringTable,
      penaltyTable: penaltyTable,
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
      rinkMap: rinkMap,
      media: {
        gameRecap:gameRecap,
        gamePreview:gamePreview
      },
      threeStars: threeStars
    })
  }

  recordArrayToStrings(records) {
    // parse team records and output as strings
    let hr = records.home;
    let ar = records.away;
    // account for when in the playoffs teams only have wins and losses
    let returnData = (hr.ot !== undefined) ? (
      {
        home: "("+hr.wins+'-'+hr.losses+'-'+hr.ot+")",
        away: "("+ar.wins+'-'+ar.losses+'-'+ar.ot+")"
      }
    ) : (
      {
        home: "("+hr.wins+'-'+hr.losses+")",
        away: "("+ar.wins+'-'+ar.losses+")"
      }
    );
    return(returnData)
  }

  shouldComponentUpdate(nextProps,nextState) {
    // only update if the data exists and is either new, from a different game in the sidebar, or the boxscore team has changed
    if ((nextProps.data !== undefined)
      && ((nextProps.data.metaData.timeStamp !== this.props.data.metaData.timeStamp) || (nextProps.data.gameData.game.pk !== this.props.data.gameData.game.pk) || (this.state.activeBoxTeam !== nextState.activeBoxTeam))) {
        return true
      } else {
        return false
      }
  }

  handleBoxScoreClick(team) {
    // handles boxscore button click
    if(team === 'home'){
      this.setState({activeBoxTeam:team});
    }else{
      this.setState({activeBoxTeam:team});
    }

  }

  render() {
    // refresh/process the new data whenever component is updated
    let allData = this.refreshGame(this.props.data,this.props.content)
    let boxData = (this.state.activeBoxTeam === 'home') ? (
      allData.homeBoxData
    ) : (
      allData.awayBoxData
    );

    let homeTeamName = this.props.data.gameData.teams.home.teamName;
    let awayTeamName = this.props.data.gameData.teams.away.teamName;

    let boxScore = '';
    let topSection = '';
    if (allData.gameState === 'final' || allData.gameState.search('progress') !== -1) {
      // boxscore is set on render to stay up to date with boxscore button clicks
      boxScore = (
        <BoxScore
          playerData={boxData}
          homeResources={allData.resources.home}
          awayResources={allData.resources.away}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          activeBoxTeam={this.state.activeBoxTeam}
          onClick={this.handleBoxScoreClick}
        />
      );
      topSection = (
        <div className="top">
          <div className="top-left">
            {allData.rinkMap}
            {allData.threeStars}
            {allData.currentPlays}
            {allData.scoringTable}
            {allData.penaltyTable}
          </div>
          <div className="top-right">
            {boxScore}
          </div>
        </div>
      )
    }

    return (
      <div className={"liveData"}>
        <div className="nav-bar">
          <span onClick={this.props.backButtonClick}><img src={ChevronLeft} /></span>
          <h3>Live Score</h3>
        </div>
        {allData.gameBanner}
        {allData.media.gameRecap}
        {allData.media.gamePreview}
        {topSection}
      </div>
    )
  }

}
