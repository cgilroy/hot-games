import React, { Component } from 'react';
import {APISideGameFetch} from './APISideGameFetch.js';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import StackGrid from 'react-stack-grid';
import './APISchedFetch.css'

export class APISchedFetch extends Component {
  constructor() {
    super();
    this.state = {
      liveGames: [],
      scheduledGames: [],
      finalGames:[],
      mainGamePk: ""
    };
    this.sideBarClick = this.sideBarClick.bind(this);
  }

  componentDidMount() {
    const refreshData = () => {
      // let dateTest = '?date=2018-10-18';
      let dateTest = '';
      fetch('https://statsapi.web.nhl.com/api/v1/schedule'+dateTest)
    .then(results => {

      return results.json();
    }).then(data => {
      let liveGames = [];
      let scheduledGames = [];
      let finalGames = [];
      for (let i = 0, j = data.dates[0].games.length; i < j; i++) {
          let iterGame = data.dates[0].games[i];
          let homeTeam = iterGame.teams.home;
          let awayTeam = iterGame.teams.away;
          let gameState = iterGame.status.detailedState;
          gameState = gameState.toLowerCase().replace(/\s/g, '');
          let gamePk = iterGame.gamePk;
          let gameTime = iterGame.gameDate;

          let sideGameDiv = (
            <div className={"sideBarGame gameDiv " + gameState} key={gamePk}>
              <APISideGameFetch gameTime={gameTime} gameID={gamePk} gameState={gameState} homeName={homeTeam.team.name} awayName={awayTeam.team.name} sideClick={this.sideBarClick} />
            </div>
          )

          // let activeGameDiv = (
          //   <div className={"sideBarGame " + gameState} key={gamePk}>
          //     <APISideGameFetch gameTime={gameTime} gameID={gamePk} gameState={gameState} homeName={homeTeam.team.name} awayName={awayTeam.team.name} toggleHandler={this.updateGridLayout} />
          //   </div>
          // )

          // let gameDiv = (
          //   <div className={"sideBarGame " + gameState} key={gamePk}>
          //     <div className={"scoreGroup"}>
          //       <div className={"sideBarScore"}>
          //         <div className={"teamName"}>{homeTeam.team.name}</div>
          //         <div className={"teamScore"}>
          //           {gameState.includes("progress") ? homeTeam.score : ""}
          //         </div>
          //         <div className={"timeRemaining"}>
          //           {gameState.includes("progress") ? gameTime :
          //         </div>
          //       </div>
          //       <div className={"sideBarScore"}>
          //         <div className={"teamName"}>{awayTeam.team.name}</div>
          //         <div className={"teamScore"}>
          //           {gameState.includes("progress") ? awayTeam.score : ""}
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // )

          if (gameState.search('progress') !== -1) {
            liveGames = liveGames.concat(sideGameDiv);
          } else if ((gameState.search('scheduled') !== -1) || (gameState.search('pre-game') !== -1)) {
            scheduledGames = scheduledGames.concat(sideGameDiv);
          } else if (gameState.search('final') !== -1) {
            finalGames = finalGames.concat(sideGameDiv);
          }

        }

        this.setState({liveGames: liveGames,scheduledGames:scheduledGames,finalGames:finalGames});
      })


  }

  refreshData();

  this._interval = window.setInterval(refreshData,5000);
}

componentWillUnMount() {
  this._interval && window.clearInterval(this._interval);
}

sideBarClick(gameFID) {
  console.log(gameFID);
  this.setState({mainGamePk: gameFID})
}

  render() {
    let test = new Date().toString()
    return (

      <div className="container2">
        {test}
        {this.state.mainGamePk}
        <button onClick={this.updateGridLayout}>update</button>
        <div className="gamesSideBar">
          <div className="gamesContainer live">
              {this.state.liveGames}
          </div>
          <div className="gamesContainer sched">
              {this.state.scheduledGames}
          </div>
          <div className="gamesContainer final">
              {this.state.finalGames}
          </div>
        </div>
      </div>
    )
  }

}
