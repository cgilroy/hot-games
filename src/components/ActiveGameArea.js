import React, { Component } from 'react';
import { ScoringTable } from './ScoringTable.js';
import { PenaltyTable } from './PenaltyTable.js';
import { LatestPlays } from './LatestPlays.js';
import { BoxScore } from './BoxScore.js';
import { RinkMap } from './RinkMap.js';
import Moment from 'react-moment';
import '../css/ActiveGameArea.css';
import resources from './TeamResources';
import StarSVG from '../resources/star.svg';
import ChevronLeft from '../resources/chevron-left.svg';

export class ActiveGameArea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeBoxTeam:'home',
    }
    this.refreshGame = this.refreshGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  refreshGame(gameData, contentData) {
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
      let currentTimeStamp = data.metaData.timeStamp;
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
      let homeTricode = data.gameData.teams.home.abbreviation;
      let awayTricode = data.gameData.teams.away.abbreviation;

      let homeBoxData = data.liveData.boxscore.teams.home;
      let awayBoxData = data.liveData.boxscore.teams.away;

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
      }

      let penaltyTable = '';
      let rinkMap='';
      if (gameState.search('progress') !== -1 || gameState === 'final') {
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
    let hr = records.home;
    let ar = records.away;
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
    if ((nextProps.data !== undefined)
      && ((nextProps.data.metaData.timeStamp !== this.props.data.metaData.timeStamp) || (nextProps.data.gameData.game.pk !== this.props.data.gameData.game.pk) || (this.state.activeBoxTeam !== nextState.activeBoxTeam))) {
        return true
      } else {
        return false
      }
  }

  handleClick(team) {
    if(team === 'home'){
      this.setState({activeBoxTeam:team});
    }else{
      this.setState({activeBoxTeam:team});
    }

  }

  render() {
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
      boxScore = (
        <BoxScore
          playerData={boxData}
          homeResources={allData.resources.home}
          awayResources={allData.resources.away}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          activeBoxTeam={this.state.activeBoxTeam}
          onClick={this.handleClick}
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

function ThreeStars(props) {
  let starLogoPaths=['','',''];
  let firstStarData = props.homeSkaterData["ID"+props.firstStar.id];
  starLogoPaths[0] = props.homeResources.logo;
  if (firstStarData === undefined) {
    firstStarData = props.awaySkaterData["ID"+props.firstStar.id]
    starLogoPaths[0] = props.awayResources.logo;
  }
  let secondStarData = props.homeSkaterData["ID"+props.secondStar.id];
  starLogoPaths[1] = props.homeResources.logo;
  if (secondStarData === undefined) {
    secondStarData = props.awaySkaterData["ID"+props.secondStar.id]
    starLogoPaths[1] = props.awayResources.logo;
  }
  let thirdStarData = props.homeSkaterData["ID"+props.thirdStar.id];
  starLogoPaths[2] = props.homeResources.logo;
  if (thirdStarData === undefined) {
    thirdStarData = props.awaySkaterData["ID"+props.thirdStar.id]
    starLogoPaths[2] = props.awayResources.logo;
  }

  let starData = [firstStarData,secondStarData,thirdStarData];
  let starTables = [];
  let errorPhotos=[];
  for (let i=0;i<=2;i++) {
    let data = starData[i];
    let jsx='';
    if (data.position.code === "G") {
      let savePercentage = (data.stats.goalieStats.shots !== 0) ? (
        +data.stats.goalieStats.saves / +data.stats.goalieStats.shots
      ) : (0);
      savePercentage = savePercentage.toFixed(3);
      errorPhotos.push("https://nhl.bamcontent.com/images/headshots/current/168x168/goalie.jpg");
      jsx = (
        <table>
        <thead>
          <tr>
            <th>SA</th>
            <th>GA</th>
            <th>SV</th>
            <th>SV%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.stats.goalieStats.shots}</td>
            <td>{data.stats.goalieStats.shots-data.stats.goalieStats.saves}</td>
            <td>{data.stats.goalieStats.saves}</td>
            <td>{savePercentage}</td>
          </tr>
        </tbody>
        </table>
      )
    } else {
      errorPhotos.push("https://nhl.bamcontent.com/images/headshots/current/168x168/skater.jpg");
      jsx = (
        <table>
          <thead>
            <tr>
              <th>G</th>
              <th>A</th>
              <th>+/-</th>
              <th>TOI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.stats.skaterStats.goals}</td>
              <td>{data.stats.skaterStats.assists}</td>
              <td>{data.stats.skaterStats.plusMinus}</td>
              <td>{data.stats.skaterStats.timeOnIce}</td>
            </tr>
          </tbody>
        </table>
      )
    }
    starTables.push(jsx);
  }
  return(
    <div className="threeStars">
      <div className="starArea">
        <img src={"https://nhl.bamcontent.com/images/headshots/current/168x168/"+props.firstStar.id+".jpg"} onError={(e)=>{e.target.onerror = null; e.target.src=errorPhotos[0]}} alt='No Photo'/>
        <span className="starName">
          <img src={starLogoPaths[0]} alt='logo' />
          {props.firstStar.fullName}
        </span>
        <div className="starStats">
          {starTables[0]}
        </div>
        <span className="stars">
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
        </span>
      </div>
      <div className="starArea">
        <img src={"https://nhl.bamcontent.com/images/headshots/current/168x168/"+props.secondStar.id+".jpg"} onError={(e)=>{e.target.onerror = null; e.target.src=errorPhotos[1]}} alt='No Photo'/>
        <span className="starName">
          <img src={starLogoPaths[1]} alt='logo'/>
          {props.secondStar.fullName}
        </span>
        <div className="starStats">
          {starTables[1]}
        </div>
        <span className="stars">
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
        </span>
      </div>
      <div className="starArea">
        <img src={"https://nhl.bamcontent.com/images/headshots/current/168x168/"+props.thirdStar.id+".jpg"} onError={(e)=>{e.target.onerror = null; e.target.src=errorPhotos[2]}} alt='No Photo'/>
        <span className="starName">
          <img src={starLogoPaths[2]} alt='logo'/>
          {props.thirdStar.fullName}
        </span>
        <div className="starStats">
          {starTables[2]}
        </div>
        <span className="stars">
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
        </span>
      </div>
    </div>
  )
}

function GameRecap(props) {
  let item = props.content.editorial.recap.items[0];
  let headline = item.headline;
  let subhead = item.subhead;
  let imgSrc = item.media.image.cuts['1136x640'].src;
  let description = item.preview;
  let bgImg = {backgroundImage:"url("+imgSrc+")"};
  return (
    <div className="gameRecap">
      <div className="blurb">
        <h1>{headline}</h1>
        <h2>{subhead}</h2>
      </div>

        <img src={imgSrc} style={{width:'100%'}} alt=''/>
        <div className="description" dangerouslySetInnerHTML={{__html:description}}></div>
    </div>
  )
}

function GamePreview(props) {
  let item = props.content.editorial.preview.items[0];
  let imgSrc = item.media.image.cuts['1136x640'].src;
  let description = item.preview;
  return (
    <div className="gamePreview">
      <div className="heroImage">
        <img src={imgSrc} alt=''/>
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

function BannerPeriodTable(props) {
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
  if (data.length > 3) {
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

function MainGameBanner(props) {
  let homeTeamResources = resources[props.homeTeamId];
  let awayTeamResources = resources[props.awayTeamId];
  let homePPLogoBadge = props.ppData.homeTeamOnPP ? (
    <span className="logoPPBadge">
      {props.ppData.powerPlayStrength}
    </span>
  ) : ('');

  let awayPPLogoBadge = props.ppData.awayTeamOnPP ? (
    <span className="logoPPBadge">
      {props.ppData.powerPlayStrength}
    </span>
  ) : ('');

  return (
    <div className="bannerContainer">
      <div className="bannerGroup home" style={{background: homeTeamResources.primaryColor}}>
        <span className="bannerLabel">HOME</span>
        {homePPLogoBadge}
        <div className="nameAndRec">
          <h1 className="nameAndRec--desktop">{props.homeTeamName}</h1>
          <h1 className="nameAndRec--mobile">{props.homeTricode}</h1>
          <span className="teamRecord">{props.records.home}</span>
        </div>
        <img src={homeTeamResources.logo} alt=''/>
        { (props.gameState.search('pre') === -1 && props.gameState.search('sched') === -1) &&
          <h2>{props.homeScore}</h2>
        }
      </div>
      {props.timeAndScore}
      <div className="bannerGroup away" style={{background: awayTeamResources.primaryColor}}>
      { (props.gameState.search('pre') === -1 && props.gameState.search('sched') === -1) &&
        <h2>{props.awayScore}</h2>
      }
        <img src={awayTeamResources.logo} alt=''/>
        <div className="nameAndRec">
          <h1 className="nameAndRec--desktop">{props.awayTeamName}</h1>
          <h1 className="nameAndRec--mobile">{props.awayTricode}</h1>
          <span className="teamRecord">{props.records.away}</span>
        </div>
        {awayPPLogoBadge}
        <span className="bannerLabel">AWAY</span>
      </div>
    </div>
  )
}
