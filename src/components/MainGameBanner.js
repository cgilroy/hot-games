import React from 'react'
import resources from './TeamResources';

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

export default MainGameBanner
