import React from 'react';
// import SimpleBar from 'simplebar-react';
// import 'simplebar/dist/simplebar.min.css';

export class ScoringTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoringData: {
        firstScoring: [],
        secondScoring:[],
        thirdScoring:[],
        otScoring:[],
        soScoring:[]
      }
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
    let scoringData = {
      firstScoring: [],
      secondScoring:[],
      thirdScoring:[],
      otScoring:[],
      soScoring:[]
    };
    for (let i = scoringPlays.length-1; i >= 0; i--) {
      let playIndex = scoringPlays[i];
      let scoringPlay = plays.allPlays[playIndex];
      let teamCode = scoringPlay.team.triCode;
      let players = scoringPlay.players;
      let period = scoringPlay.about.ordinalNum;
      let strength = scoringPlay.result.strength.code;
      let emptyNet = scoringPlay.result.emptyNet;
      let scoreArray = scoringPlay.about.goals;
      let time = scoringPlay.about.periodTime.replace(/^0/,'');
      let scorer = '';
      let assistOne = '';
      let assistTwo = '';
      let seasonTotal = '';
      for (let j = 0, k = players.length; j < k; j++) {
        // let scorer = '';
        // let assistOne = '';
        // let assistTwo = '';
        switch (players[j].playerType) {
          case 'Scorer':
            scorer = players[j].player.fullName;
            seasonTotal = players[j].seasonTotal;
            break;
          case 'Assist':
            if(j<2){
              assistOne = players[j].player.fullName;
            }else {
              assistTwo = players[j].player.fullName;
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

      let imgPath = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      if (scoringPlay.team !== undefined) {
        imgPath = (scoringPlay.team.triCode === this.props.homeTricode) ? (
          this.props.homeResources.imagePath
        ) : (this.props.awayResources.imagePath)
      }

      // if (strength !== 'EVEN') {
      //   strength = (
      //     <p className="goalStrength">({strength})</p>
      //   )
      // } else {
      //   strength = '';
      // }
      let scoreData = '';
      if (period !== "SO") {
        scoreData = (
          <div className="scoreData">
            <p className="scorer">{scorer+ " (" + seasonTotal + ")"}</p>
            <div className="assistData">
              <p className="assistOne">{assistOne}</p>
              <p className="assistTwo">{assistTwo}</p>
            </div>
          </div>
        )
      } else {
        scoreData = (
          <div className="scoreData">
            <p className="scorer">{scorer+ " (Shootout Winner)"}</p>
          </div>
        );
        if (this.props.homeTricode === scoringPlay.team.triCode) {
          scoreArray.home = scoreArray.home + 1;
        } else {
          scoreArray.away = scoreArray.away + 1;
        }
      }

      let scoreDiv = (
        <div className="scoringRowScore">
          <span style={{background: this.props.homeResources.primaryColor}}>{scoreArray.home}</span>
          <span style={{background: this.props.awayResources.primaryColor}}>{scoreArray.away}</span>
        </div>
      );

        let rowMarkup = (
          <div className="scoringRow" key={i}>
            <img src={imgPath} alt=''/>
            <h4>{teamCode}</h4>
            {scoreDiv}
            {emptyNet}
            {strength}
            {scoreData}
            <div className="scoreTime">
              <h4>{time}&nbsp;</h4>
            </div>
          </div>
        );
        if (rowMarkup !== undefined) {
          switch (period) {
            case '1st':
              scoringData.firstScoring.push(rowMarkup);
              break;
            case '2nd':
              scoringData.secondScoring.push(rowMarkup);
              break;
            case '3rd':
              scoringData.thirdScoring.push(rowMarkup);
              break;
            case 'SO':
              scoringData.soScoring.push(rowMarkup);
              break;
            default:
              scoringData.otScoring.push(rowMarkup);
              break;
          }
        }


      // ...
    }
    return scoringData;
  }


  render() {

    let scoringData = this.parseScoringData(this.props.plays);
    let noScoreMessage = '';
    if (scoringData.firstScoring.length === 0 && scoringData.secondScoring.length === 0 && scoringData.thirdScoring.length === 0 && scoringData.otScoring.length === 0 && scoringData.soScoring.length === 0) {
      noScoreMessage = <div className="no-scoring-message">No Score</div>
    }
    return(
      <div className="scoringTable">
        <div className="section-title">
          <h1>Scoring Summary</h1>
        </div>
        {noScoreMessage}
        {(scoringData.soScoring !== undefined && scoringData.soScoring.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>SO</span>
            </div>
            {scoringData.soScoring[0]}
          </div>
        }
        {(scoringData.otScoring !== undefined && scoringData.otScoring.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>OT</span>
            </div>
            {scoringData.otScoring}
          </div>
        }
        {(scoringData.thirdScoring !== undefined && scoringData.thirdScoring.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>3rd Period</span>
            </div>
            {scoringData.thirdScoring}
          </div>
        }
        {(scoringData.secondScoring !== undefined && scoringData.secondScoring.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>2nd Period</span>
            </div>
            {scoringData.secondScoring}
          </div>
        }
        {(scoringData.firstScoring !== undefined && scoringData.firstScoring.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>1st Period</span>
            </div>
            {scoringData.firstScoring}
          </div>
        }
      </div>
    )
  }
}
