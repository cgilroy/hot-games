import React, { Component } from 'react';
import {SideBarGame} from './SideBarGame.js';
import {ActiveGameArea} from './ActiveGameArea.js';
import './APISchedFetch.css';
import { BounceLoader } from 'react-spinners';
// import { css } from '@emotion/core';

export class APISchedFetch extends Component {
  constructor() {
    super();
    this.state = {
      liveGames: [],
      scheduledGames: [],
      finalGames:[],
      mainGamePk: "",
      gamesData:[],
      gamesContentData:[],
      loading:true,
      records:[]
    };
    this.sideBarClick = this.sideBarClick.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  refreshData() {
    // let dateTest = '?date=2019-02-07';
    let dateTest = '';
    fetch('https://statsapi.web.nhl.com/api/v1/schedule'+dateTest)
  .then(schedResults => {
    return schedResults.json();
  }).then(data => {
    let liveGames = [];
    let scheduledGames = [];
    let finalGames = [];
    let allGames = [];
    let allGamesJSON = [];
    let gamesContentData = [];
    let records = [];
    var fetches = [];
    console.log("dateslength",data.dates[0].games.length)
    for (let i = 0, j = data.dates[0].games.length; i < j; i++) {
      let iterGame = data.dates[0].games[i];
      let homeTeam = iterGame.teams.home;
      let awayTeam = iterGame.teams.away;
      let gameState = iterGame.status.detailedState;
      gameState = gameState.toLowerCase().replace(/\s/g, '');
      let gamePk = iterGame.gamePk;
      // let gameTime = iterGame.gameDate;
      let gameRecords = {
        gamePk: gamePk,
        home: homeTeam.leagueRecord,
        away: awayTeam.leagueRecord
      }
      records.push(gameRecords);

      let apiString = 'https://statsapi.web.nhl.com//api/v1/game/' + gamePk + '/feed/live';
      let apiContentString = 'https://statsapi.web.nhl.com/api/v1/game/' + gamePk + '/content'
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
      );
      fetches.push(
        fetch(apiContentString)
        .then(contentRaw => {
          return contentRaw.json();
        }).then(content => {
            gamesContentData = gamesContentData.concat(content);
        })
      )
    };

    Promise.all(fetches).then(() => {
      console.log("allGames",allGames[2]);
      sortByKey(liveGames,'gamePk');
      sortByKey(scheduledGames,'gamePk');
      sortByKey(finalGames,'gamePk');
      sortByKey(allGamesJSON,'gamePk');
      // this.setState({liveGames: allGames[0],scheduledGames:allGames[1],finalGames:allGames[2]});
      if (this.state.mainGamePk === "") {
        let firstGamePk = allGames[3].dates[0].games[0].gamePk;
        this.setState({
          loading:false,
          liveGames: allGames[0],
          scheduledGames:allGames[1],
          finalGames:allGames[2],
          mainGamePk:firstGamePk,
          gamesData:allGamesJSON,
          gamesContentData:gamesContentData,
          records:records
        });
      } else {
        this.setState({
          loading:false,
          liveGames: allGames[0],
          scheduledGames:allGames[1],
          finalGames:allGames[2],
          gamesData:allGamesJSON,
          gamesContentData:gamesContentData,
          records:records
        });
      }
    })
     .catch(err => {return console.log(err);});

    })

  }


  componentDidMount() {

  this.refreshData();

  this._interval = window.setInterval(this.refreshData,5000);
}

componentWillUnMount() {
  this._interval && window.clearInterval(this._interval);
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
    let tc = this.state.gamesContentData;
    let activeGameContent = tc.find(obj => {
      return obj.link === '/api/v1/game/' + activeGameVar + '/content'
    });
    let r = this.state.records;
    let activeRecords = r.find(obj => {
      return obj.gamePk === activeGameVar
    });
    let mainGameArea = (this.state.loading) ? (
      <BounceLoader
        sizeUnit={"px"}
        size={50}
        color={'#262626'}
        loading={this.state.loading}
      />
    ) : (
      <ActiveGameArea gameID={activeGameVar} data={activeGameData} content={activeGameContent} records={activeRecords} />
    )
    return (

      <div className="totalViewContainer">
        <div className="gamesSideBar">
            <div className="gamesScroll">
              <h3>Today's Games</h3>
              <div className="gamesContainer live">
                {
                  this.state.liveGames.map((game) => <SideBarGame key={game.gameData.game.pk} sideClick={this.sideBarClick} data={game} activeID={this.state.mainGamePk} />)
                }
              </div>
              <div className="gamesContainer sched">
                {
                  this.state.scheduledGames.map((game) => <SideBarGame key={game.gameData.game.pk} sideClick={this.sideBarClick} data={game} activeID={this.state.mainGamePk} />)
                }
              </div>
              <div className="gamesContainer final">
                {
                  this.state.finalGames.map((game) => <SideBarGame key={game.gameData.game.pk} sideClick={this.sideBarClick} data={game} activeID={this.state.mainGamePk} />)
                }
              </div>
            </div>
            <div className="disclaimer">
              <p>This website is not in any way affiliated with the National Hockey League (NHL) or any of its respective teams. The NHL logo, team logos, team names, and other trademarks/copyrighted images are the property of their respective owners.</p>
              <p>If you are the owner of a trademark/copyrighted material that is used on this website and would like it removed, please <a href="mailto:c.gilroy9@gmail.com?Subject=Trademark/Copyright%20Issue">contact me</a>.</p>
            </div>
        </div>
        <div className={"mainGameArea " + (this.state.loading ? 'loading' : '')}>
          { mainGameArea }
        </div>
      </div>
    )
  }

}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
