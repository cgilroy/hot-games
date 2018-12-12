import React from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export class ScoringTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoringData: [],
    }
    this.parseScoringData = this.parseScoringData.bind(this);
    this.superscriptPeriod = this.superscriptPeriod.bind(this);
  }

  superscriptPeriod(period) {
    switch (period) {
      case '1st':
        return (<h4>1<sup>st</sup></h4>);
      case '2nd':
        return (<h4>2<sup>nd</sup></h4>);
      case '3rd':
        return (<h4>3<sup>rd</sup></h4>);
      default:
    return (<h4>{period}</h4>);
    }
  }

  parseScoringData(plays) {
    let scoringPlays = plays.scoringPlays;
    let scoringData = [];
    for (let i = 0, l = scoringPlays.length; i < l; i++) {
      let playIndex = scoringPlays[i];
      let scoringPlay = plays.allPlays[playIndex];
      let teamCode = scoringPlay.team.triCode;
      let players = scoringPlay.players;
      let period = scoringPlay.about.ordinalNum;
      let strength = scoringPlay.result.strength.code;
      let emptyNet = scoringPlay.result.emptyNet;
      let time = scoringPlay.about.periodTime.replace(/^0/,'');
      this.scorer = '';
      this.assistOne = '';
      this.assistTwo = '';
      for (let j = 0, k = players.length; j < k; j++) {
        // let scorer = '';
        // let assistOne = '';
        // let assistTwo = '';
        switch (players[j].playerType) {
          case 'Scorer':
            this.scorer = players[j].player.fullName + " (" + players[j].seasonTotal + ")";
            break;
          case 'Assist':
            if(j<2){
              this.assistOne = players[j].player.fullName;
            }else {
              this.assistTwo = players[j].player.fullName;
            };
            break;
          default:

        }
      }

      strength = (strength !== 'EVEN') ? (
        <p className="goalStrength">({strength})</p>
      ) : ('');

      emptyNet = emptyNet ? (
        <p className="emptyNet">(EN)</p>
      ) : ('');

      // if (strength !== 'EVEN') {
      //   strength = (
      //     <p className="goalStrength">({strength})</p>
      //   )
      // } else {
      //   strength = '';
      // }

      if (scoringData !== undefined) {
        scoringData.push(
          <div className="scoringRow" key={i}>
            <h4>{teamCode}</h4>
            {emptyNet}
            {strength}
            <div className="scoreData">
              <p className="scorer">{this.scorer}</p>
              <div className="assistData">
                <p className="assistOne">{this.assistOne}</p>
                <p className="assistTwo">{this.assistTwo}</p>
              </div>
            </div>
            <div className="scoreTime">
              <h4>{time}&nbsp;</h4>
              {this.superscriptPeriod(period)}
            </div>
          </div>
        )
      }


      // ...
    }
    return scoringData;
  }


  render() {

    let scoringData = this.parseScoringData(this.props.plays);
    if (scoringData.length === 0) {
      scoringData = <div className="no-scoring-message">No Score</div>
    }
    return(
      <div className="scoringTable">
        <SimpleBar>
          {scoringData}
        </SimpleBar>
      </div>
    )
  }
}
