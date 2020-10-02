import React, { Component } from 'react';
import {SideBarGame} from './SideBarGame.js';
import {ActiveGameArea} from './ActiveGameArea.js';
import '../css/APISchedFetch.css';
import { BounceLoader } from 'react-spinners';
import NHLShieldLogo from '../resources/NHL-Shield-Logo.svg';
import { MyDatePicker } from './MyDatePicker.js';
import moment from 'moment'
// import { css } from '@emotion/core';

export class APISchedFetch extends Component {
  constructor() {
    super();
    this.state = {
      // date: moment().format('YYYY-MM-DD'),
      date: '2020-09-28',
      liveGames: [], // array of game data for live games
      scheduledGames: [], // array of game data for scheduled games
      finalGames:[], // array of game data for ended games
      mainGamePk: "", // gamePk (id) of the game to be displayed in the main game area
      gamesData:[], // array of all game data
      gamesContentData:[], // array of all content (pregame/postgame) data
      loading:true,
      records:[],
      mobileActive:'list' // keeps track of view state for mobile (list => display the list; gameView => display the game data)
    };
    this.sideBarClick = this.sideBarClick.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  refreshData(date = this.state.date) {
    // let dateTest = '?date=2019-03-09';
    // let fetchDate = date || this.state.date
    let dateTest = '';
    fetch('https://statsapi.web.nhl.com/api/v1/schedule?date='+date) // fetching the scheduled games from the NHL API
  .then(schedResults => {
    return schedResults.json();
  }).then(data => {
    // if there are no games, stop loading, leave the function, and hide the sidebar
    if (data.dates.length === 0) {
      this.setState({
        loading: false
        // mobileActive: 'gameView'
      })
      return
    };

    let liveGames = [];
    let scheduledGames = [];
    let finalGames = [];
    let allGames = [];
    let allGamesJSON = [];
    let gamesContentData = [];
    let records = [];
    var fetches = [];
    // looping through the scheduled games for the day
    for (let i = 0, j = data.dates[0].games.length; i < j; i++) {
      let iterGame = data.dates[0].games[i];
      let homeTeam = iterGame.teams.home;
      let awayTeam = iterGame.teams.away;
      let gameState = iterGame.status.detailedState;
      gameState = gameState.toLowerCase().replace(/\s/g, '');
      let gamePk = iterGame.gamePk;
      let gameRecords = {
        gamePk: gamePk,
        home: homeTeam.leagueRecord,
        away: awayTeam.leagueRecord
      }
      records.push(gameRecords);

      let apiString = 'https://statsapi.web.nhl.com//api/v1/game/' + gamePk + '/feed/live';
      let apiContentString = 'https://statsapi.web.nhl.com/api/v1/game/' + gamePk + '/content'
      // fetch live game data for each game; each fetch is added to an array of Promises to be sure all data is fetched before parsing
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
      // content data is available at a different endpoint and needs its own fetch
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
      // all promises resolved so now we can update the data in the app (but we need to sort it as Promises are not necessarily resolved in order)
      sortByKey(liveGames,'gamePk');
      sortByKey(scheduledGames,'gamePk');
      sortByKey(finalGames,'gamePk');
      sortByKey(allGamesJSON,'gamePk');
      // if no main game is set, default to the first one
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
    this._interval = window.setInterval(this.refreshData,10000); // set refresh interval to 5s
  }

  componentWillUnMount() {
    this._interval && window.clearInterval(this._interval); // remove refresh interval when unmounted
  }

  sideBarClick(gameFID) {
    this.setState({mainGamePk: gameFID, mobileActive:'gameView'}); // handles sidebar game click
  }

  backButtonClick() {
    this.setState({mobileActive:'list'}); // used for mobile to provide back button functionality
  }

  handleDateChange(date) {
    this.setState({
        date:date,
        liveGames: [], // array of game data for live games
        scheduledGames: [], // array of game data for scheduled games
        finalGames:[], // array of game data for ended games
        mainGamePk: "", // gamePk (id) of the game to be displayed in the main game area
        gamesData:[], // array of all game data
        gamesContentData:[], // array of all content (pregame/postgame) data
        loading:true,
        records:[],
        // mobileActive:'list' // keeps track of view state for mobile (list => display the list; gameView => display the game data)
    })
    this.refreshData(date)
    // this.setState({date:date})
  }

  render() {
    let activeGameVar = this.state.mainGamePk;
    // grab the game data to be displayed for the selected sidebar game
    let tg = this.state.gamesData;
    let activeGameData = tg.find(obj => {
      return obj.gamePk == activeGameVar
    });

    // grab the preview/postgame data to be displayed for the selected sidebar game
    let tc = this.state.gamesContentData;
    let activeGameContent = tc.find(obj => {
      return obj.link === '/api/v1/game/' + activeGameVar + '/content'
    });
    let r = this.state.records;
    let activeRecords = r.find(obj => {
      return obj.gamePk === activeGameVar
    });

    // if content is loading display the bounce loader in the main game area
    let mainGameArea = ''
    let sideBarArea = ''
    if (this.state.loading) {
      sideBarArea = (
        <div className={'gamesSideBar ' + (this.state.mobileActive === 'list' ? 'mobileActive' : '')}>
          <div className="gamesScroll">
            
            <MyDatePicker date={this.state.date} updateDate={this.handleDateChange}/>
            <p>Loading...</p>
          </div>
          <div className="disclaimer">
            <p>This website is not in any way affiliated with the National Hockey League (NHL) or any of its respective teams. The NHL logo, team logos, team names, and other trademarks/copyrighted images are the property of their respective owners.</p>
            <p>If you are the owner of a trademark/copyrighted material that is used on this website and would like it removed, please <a href="mailto:c.gilroy9@gmail.com?Subject=Trademark/Copyright%20Issue">contact me</a>.</p>
          </div>
        </div>
      );
      mainGameArea = (
        <BounceLoader
          sizeUnit={"px"}
          size={50}
          color={'#262626'}
          loading={this.state.loading}
        />
      );
    } else {
      if (this.state.gamesData.length !== 0) {
        mainGameArea = <ActiveGameArea backButtonClick={() => this.backButtonClick()} gameID={activeGameVar} data={activeGameData} content={activeGameContent} records={activeRecords} mobileActive={this.state.mobileActive}/>
        sideBarArea = (
          <div className={'gamesSideBar ' + (this.state.mobileActive === 'list' ? 'mobileActive' : '')}>
            <div className="gamesScroll">
              
              <MyDatePicker date={this.state.date} updateDate={this.handleDateChange}/>
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
        )
      } else {
        sideBarArea = (
          <div className={'gamesSideBar ' + (this.state.mobileActive === 'list' ? 'mobileActive' : '')}>
            <div className="gamesScroll">
              
              <MyDatePicker date={this.state.date} updateDate={this.handleDateChange}/>
              <p>No Games</p>
            </div>
            <div className="disclaimer">
              <p>This website is not in any way affiliated with the National Hockey League (NHL) or any of its respective teams. The NHL logo, team logos, team names, and other trademarks/copyrighted images are the property of their respective owners.</p>
              <p>If you are the owner of a trademark/copyrighted material that is used on this website and would like it removed, please <a href="mailto:c.gilroy9@gmail.com?Subject=Trademark/Copyright%20Issue">contact me</a>.</p>
            </div>
          </div>
        )
        mainGameArea = (
          <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center'}}>
            <div className='noMediaContent'>
              <img src={NHLShieldLogo} alt='NHL Logo'/>
              <h1>No Games Scheduled</h1>
            </div>
          </div>
        )
      }
    }

    return (

      <div className="totalViewContainer">
        { sideBarArea }
        <div className={"mainGameArea " + (this.state.loading ? 'loading ' : '') + (this.state.mobileActive === 'gameView' ? 'mobileActive' : '')}>
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
