import React from 'react';
// import SimpleBar from 'simplebar-react';
// import 'simplebar/dist/simplebar.min.css';

export class PenaltyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      penaltyData: {
        firstPlays: [],
        secondPlays:[],
        thirdPlays:[],
        otPlays:[]
      }
    }
    this.parseData = this.parseData.bind(this);
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

  parseData(plays) {
    let penaltyPlays = plays.penaltyPlays;
    let penaltyData = {
      firstPlays: [],
      secondPlays:[],
      thirdPlays:[],
      otPlays:[]
    };
    for (let i = penaltyPlays.length-1; i >= 0; i--) {
      let playIndex = penaltyPlays[i];
      let penaltyPlay = plays.allPlays[playIndex];
      let teamCode = penaltyPlay.team.triCode;
      let players = penaltyPlay.players;
      let period = penaltyPlay.about.ordinalNum;
      let time = penaltyPlay.about.periodTime.replace(/^0/,'');
      let description = penaltyPlay.result.description;
      this.penaltyOn = '';
      this.drewBy = '';
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

      let imgPath = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      if (penaltyPlay.team !== undefined) {
        imgPath = (penaltyPlay.team.triCode === this.props.homeTricode) ? (
          this.props.homeResources.imagePath
        ) : (this.props.awayResources.imagePath)
      }

        let rowMarkup = (

          <div className="scoringRow" key={penaltyPlay.about.eventIdx}>
            <img src={imgPath} alt=''/>
            <h4>{teamCode}</h4>
            <div className="scoreData">
              <p className="scorer">{description}</p>
            </div>
            <div className="scoreTime">
              <h4>{time}&nbsp;</h4>
            </div>
          </div>
        );
        if (rowMarkup !== undefined) {
          switch (period) {
            case '1st':
              penaltyData.firstPlays.push(rowMarkup);
              break;
            case '2nd':
              penaltyData.secondPlays.push(rowMarkup);
              break;
            case '3rd':
              penaltyData.thirdPlays.push(rowMarkup);
              break;
            default:
              penaltyData.otPlays.push(rowMarkup);
              break;
          }
        }


      // ...
    }
    return penaltyData;
  }


  render() {

    let penaltyData = this.parseData(this.props.plays);
    let noPenaltyMessage = '';
    if (penaltyData.firstPlays.length === 0 && penaltyData.secondPlays.length === 0 && penaltyData.thirdPlays.length === 0 && penaltyData.otPlays.length === 0) {
      noPenaltyMessage = <div className="no-scoring-message">No Penalties</div>
    }
    return(
      <div className="penaltyTable">
        <div className="section-title">
          <h1>Penalty Summary</h1>
        </div>
        {noPenaltyMessage}
        {(penaltyData.otPlays !== undefined && penaltyData.otPlays.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>OT</span>
            </div>
            {penaltyData.otPlays}
          </div>
        }
        {(penaltyData.thirdPlays !== undefined && penaltyData.thirdPlays.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>3rd Period</span>
            </div>
            {penaltyData.thirdPlays}
          </div>
        }
        {(penaltyData.secondPlays !== undefined && penaltyData.secondPlays.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>2nd Period</span>
            </div>
            {penaltyData.secondPlays}
          </div>
        }
        {(penaltyData.firstPlays !== undefined && penaltyData.firstPlays.length !== 0) &&
          <div className="periodSection">
            <div className="scoringRow periodHeader">
              <span>1st Period</span>
            </div>
            {penaltyData.firstPlays}
          </div>
        }
      </div>
    )
  }
}
