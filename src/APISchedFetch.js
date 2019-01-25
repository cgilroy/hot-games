import React, { Component } from 'react';
import {APISideGameFetch} from './APISideGameFetch.js';
import {APIActiveGameFetch} from './APIActiveGameFetch.js';
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
      mainGamePk: "",
      gamesData:[]
    };
    this.sideBarClick = this.sideBarClick.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  refreshData() {
    let dateTest = '?date=2019-01-18';
    // let dateTest = '';
    fetch('https://statsapi.web.nhl.com/api/v1/schedule'+dateTest)
  .then(schedResults => {
    return schedResults.json();
  }).then(data => {
    let liveGames = [];
    let scheduledGames = [];
    let finalGames = [];
    let allGames = [];
    let allGamesJSON = [];
    var fetches = [];
    console.log("dateslength",data.dates[0].games.length)
    for (let i = 0, j = data.dates[0].games.length; i < j; i++) {
      let iterGame = data.dates[0].games[i];
      let homeTeam = iterGame.teams.home;
      let awayTeam = iterGame.teams.away;
      let gameState = iterGame.status.detailedState;
      gameState = gameState.toLowerCase().replace(/\s/g, '');
      let gamePk = iterGame.gamePk;
      let gameTime = iterGame.gameDate;
      let apiString = 'https://statsapi.web.nhl.com//api/v1/game/' + gamePk + '/feed/live';
      fetches.push(
        fetch(apiString)
        .then(gameResults => {
          return gameResults.json();
        }).then(gameData => {

          if (gameState.search('progress') !== -1) {
            liveGames = liveGames.concat(gameData);
          } else if ((gameState.search('scheduled') !== -1) || (gameState.search('pre-game') !== -1)) {
            scheduledGames = scheduledGames.concat(gameData);
          } else if (gameState.search('final') !== -1) {
            finalGames = finalGames.concat(gameData);
          }
          allGames = [liveGames,scheduledGames,finalGames,data];
          allGamesJSON = allGamesJSON.concat(gameData);
        })

      )
    };

    Promise.all(fetches).then(() => {
      console.log("allGames",allGames[2]);
      // this.setState({liveGames: allGames[0],scheduledGames:allGames[1],finalGames:allGames[2]});
      if (this.state.mainGamePk === "") {
        let firstGamePk = allGames[3].dates[0].games[0].gamePk;
        this.setState({liveGames: allGames[0],scheduledGames:allGames[1],finalGames:allGames[2],mainGamePk:firstGamePk,gamesData:allGamesJSON});
      } else {
        this.setState({liveGames: allGames[0],scheduledGames:allGames[1],finalGames:allGames[2],gamesData:allGamesJSON});
      }
    })
     .catch(err => {return console.log(err);});

    })

  }


  componentDidMount() {

  this.refreshData();

  // this._interval = window.setInterval(this.refreshData,5000);
}

componentWillUnMount() {
  // this._interval && window.clearInterval(this._interval);
}

sideBarClick(gameFID) {
  console.log(gameFID);
  this.setState({mainGamePk: gameFID});


}

  render() {
    let test = new Date().toString();
    let activeGameVar = this.state.mainGamePk;
    let a= this.state.liveGames;
    let b= this.state.scheduledGames;
    let c = this.state.finalGames;
    let tg = this.state.gamesData;
    let activeGameData = tg.find(obj => {
      return obj.gamePk == activeGameVar
    });
    return (

      <div className="totalViewContainer">
        <div className="gamesSideBar">
            <img src={'/resources/hockey-night-live-logo.jpg'}/>
            <div className="gamesScroll">
              <div className="gamesContainer live">
                {
                  this.state.liveGames.map((game) => <APISideGameFetch sideClick={this.sideBarClick} data={game} activeID={this.state.mainGamePk} />)
                }
              </div>
              <div className="gamesContainer sched">
                {
                  this.state.scheduledGames.map((game) => <APISideGameFetch sideClick={this.sideBarClick} data={game} activeID={this.state.mainGamePk} />)
                }
              </div>
              <div className="gamesContainer final">
                {
                  this.state.finalGames.map((game) => <APISideGameFetch sideClick={this.sideBarClick} data={game} activeID={this.state.mainGamePk} />)
                }
              </div>
            </div>
        </div>
        <div className="mainGameArea">
          <APIActiveGameFetch gameID={activeGameVar} data={activeGameData} />
        </div>
      </div>
    )
  }

}
