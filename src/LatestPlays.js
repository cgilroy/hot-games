import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group'; // ES6
// var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); // ES5 with npm
import SimpleBar from 'simplebar-react';

export class LatestPlays extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playData: [],
      playCount: 0,
      prevLastEventId:'',
      playsToAdd:'',
      gamePk: props.gamePk
    }
    this.parsePlayData = this.parsePlayData.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  shouldAddPlay(play) {

  }

  superscriptPeriod(period) {
    switch (period) {
      case '1st':
        return (<span>1<sup>st</sup></span>);
      case '2nd':
        return (<span>2<sup>nd</sup></span>);
      case '3rd':
        return (<span>3<sup>rd</sup></span>);
      default:
    return (<span>{period}</span>);
    }
  }

  parsePlayData(plays,gameId) {
    let lastPlay = plays[plays.length-1];
    let lastPlayId = lastPlay.about.eventIdx;
    let prevLastEventId = (gameId !== this.state.gamePk) ? ('') : (this.state.prevLastEventId);
    if (lastPlayId > prevLastEventId) {
      let playsArrayData = (prevLastEventId !== '') ? (
        plays.slice(prevLastEventId+1,lastPlayId+1)
      ) : (plays.slice(-10));
      let playsToAdd = [];
      for (let i = 0, j = playsArrayData.length; i < j; i++) {
        let iterPlay = playsArrayData[i];
        let playDescription = iterPlay.result.description;
        let playTime = iterPlay.about.periodTime.replace(/^0/,'');
        let period = iterPlay.about.ordinalNum;
        period = this.superscriptPeriod(period);
        let newPlay = (
          <div className="eventRow" key={iterPlay.about.eventIdx}>
            <p>{playDescription}</p>
            <p>({playTime})</p>
            <p>{period}</p>
          </div>
        );

        playsToAdd = [newPlay].concat(playsToAdd);
      }
      let playData = (gameId !== this.state.gamePk) ? ([]) : (this.state.playData);
      playData = playsToAdd.concat(playData);
      playData = playData.slice(0,10);
      let playCount = this.state.playCount + playsArrayData.length;
      this.setState({
        playData:playData,
        playCount: playCount,
        prevLastEventId:lastPlayId,
        gamePk: gameId
      });
    }

      // ...
  }
    componentDidMount() {

      if (this.props.plays !== undefined && this.props.plays.length !== 0) {
        this.parsePlayData(this.props.plays);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.plays !== undefined && nextProps.plays.length !== 0) {
        this.parsePlayData(nextProps.plays,nextProps.gamePk);
      }
    }

    addItem() {

      let newItems = [
        <div className="eventRow" key={Date().toString()}>
          <p>haha</p>
          <p>hahah</p>
          <p>okay</p>
        </div>
      ];
      newItems = newItems.concat(this.state.playData);
      newItems = newItems.slice(0,10);
        this.setState({playData:newItems});
    }


  render() {
    let items = this.state.playData;
    return(
      <SimpleBar style={{height:'288px'}}>
        <div className="latestPlays">
          <CSSTransitionGroup
            transitionName="latestPlaysTransitionGroup"
            transitionEnterTimeout={0}
            transitionLeaveTimeout={0}>
            {this.state.playData}
          </CSSTransitionGroup>
        </div>
      </SimpleBar>
    )
  }
}
