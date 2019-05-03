import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group'; // ES6

export class LatestPlays extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playData: [], // play data to display
      playCount: 0,
      prevLastEventId:'', // keeps track of last event added to list to prevent duplicates
      playsToAdd:'', // plays to add to the displayed playData
      gamePk: props.gamePk
    }
    this.parsePlayData = this.parsePlayData.bind(this);
  }

  parsePlayData(data) {
    let lastPlay = data.plays[data.plays.length-1];
    let lastPlayId = lastPlay.about.eventIdx;
    let prevLastEventId = (data.gamePk !== this.state.gamePk) ? ('') : (this.state.prevLastEventId);
    if (lastPlayId > prevLastEventId) {
      let playsArrayData = (prevLastEventId !== '') ? (
        data.plays.slice(prevLastEventId+1,lastPlayId+1)
      ) : (data.plays.slice(-10));
      let playsToAdd = [];
      for (let i = 0, j = playsArrayData.length; i < j; i++) {
        let iterPlay = playsArrayData[i];
        let playDescription = iterPlay.result.description;
        let playTime = iterPlay.about.periodTime.replace(/^0/,'');
        let period = iterPlay.about.ordinalNum;
        period = this.superscriptPeriod(period);
        let imgPath = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
        if (iterPlay.team !== undefined) {
          imgPath = (iterPlay.team.triCode === data.homeTricode) ? (
            data.homeResources.logo
          ) : (data.awayResources.logo)
        }
        let newPlay = (
          <div className="eventRow" key={iterPlay.about.eventIdx}>
            <div className={'eventTimeAndScore'}>
              <p>{period}</p>
              <p>{playTime}</p>
            </div>
            <img src={imgPath} alt='' />
            <p>{playDescription}</p>
          </div>
        );

        playsToAdd = [newPlay].concat(playsToAdd);
      }
      let playData = (data.gamePk !== this.state.gamePk) ? ([]) : (this.state.playData);
      playData = playsToAdd.concat(playData);
      playData = playData.slice(0,10);
      let playCount = this.state.playCount + playsArrayData.length;
      this.setState({
        playData:playData,
        playCount: playCount,
        prevLastEventId:lastPlayId,
        gamePk: data.gamePk
      });
    }

      // ...
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

  componentDidMount() {

    if (this.props.plays !== undefined && this.props.plays.length !== 0) {
      this.parsePlayData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.plays !== undefined && nextProps.plays.length !== 0) {
      this.parsePlayData(nextProps);
    }
  }


  render() {

    return(

        <div className="latestPlays">
          <div className="section-title">
            <h1>Last 10 Plays</h1>
          </div>
          <CSSTransitionGroup
            transitionName="latestPlaysTransitionGroup"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            transitionLeave={false}>
            {this.state.playData}
          </CSSTransitionGroup>
        </div>

    )
  }
}
