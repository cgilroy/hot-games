import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export class BoxScoreStateless extends React.Component {

  parseStatData = (playerData) => {
    let players = playerData.players;
    let keys = Object.keys(players);
    let forwardArray = [];
    let defenseArray = [];
    let goalieArray = [];
    let allPlayersArray = [];
    for (let i = 0, j = keys.length; i < j; i++) {
      let player = players[keys[i]];
      if (player.stats !== undefined) {

        let playerStats = player.stats;
        let playerType = player.position.type;
        let fullName = '';
        let firstInitial = '';
        let lastName = '';
        if (playerType === 'Forward') {
          let skaterStats = playerStats.skaterStats;
          fullName = player.person.fullName.split(' ');
          firstInitial = fullName[0].charAt(0);
          lastName = fullName[fullName.length - 1];
          let currentForwardArray = {
            name: firstInitial + '. ' + lastName,
            goals: skaterStats.goals,
            assists: skaterStats.assists,
            points: +skaterStats.goals + +skaterStats.assists,
            plusMinus: skaterStats.plusMinus,
            shots: skaterStats.shots,
            penaltyMinutes: skaterStats.penaltyMinutes,
            hits: skaterStats.hits,
            blocked: skaterStats.blocked,
            giveaways: skaterStats.giveaways,
            takeaways: skaterStats.takeaways,
            faceOffPct: +skaterStats.faceOffWins / +skaterStats.faceoffTaken,
            timeOnIce: skaterStats.timeOnIce,
            powerPlayTimeOnIce: skaterStats.powerPlayTimeOnIce,
            shortHandedTimeOnIce: skaterStats.shortHandedTimeOnIce

          };
          forwardArray.push(currentForwardArray);
        } else if (playerType === 'Defenseman') {
          let skaterStats = playerStats.skaterStats;
          fullName = player.person.fullName.split(' ');
          firstInitial = fullName[0].charAt(0);
          lastName = fullName[fullName.length - 1];
          let currentDefenseArray = {
            name: firstInitial + '. ' + lastName,
            goals: skaterStats.goals,
            assists: skaterStats.assists,
            points: +skaterStats.goals + +skaterStats.assists,
            plusMinus: skaterStats.plusMinus,
            shots: skaterStats.shots,
            penaltyMinutes: skaterStats.penaltyMinutes,
            hits: skaterStats.hits,
            blocked: skaterStats.blocked,
            giveaways: skaterStats.giveaways,
            takeaways: skaterStats.takeaways,
            faceOffPct: +skaterStats.faceOffWins / +skaterStats.faceoffTaken,
            timeOnIce: skaterStats.timeOnIce,
            powerPlayTimeOnIce: skaterStats.powerPlayTimeOnIce,
            shortHandedTimeOnIce: skaterStats.shortHandedTimeOnIce
          };
          defenseArray.push(currentDefenseArray);
        } else if (playerType === 'Goalie') {
          let goalieStats = playerStats.goalieStats;
          fullName = player.person.fullName.split(' ');
          firstInitial = fullName[0].charAt(0);
          lastName = fullName[fullName.length - 1];
          let savePercentage = (goalieStats.shots !== 0) ? (
            +goalieStats.saves / +goalieStats.shots
          ) : (0);
          savePercentage = savePercentage.toFixed(3);
          let currentGoalieArray = {
            name: firstInitial + '. ' + lastName,
            saves: goalieStats.saves,
            shots: goalieStats.shots,
            savePercentage: savePercentage,
            timeOnIce: goalieStats.timeOnIce
          };
          goalieArray.push(currentGoalieArray);
        }

      };

    }
    allPlayersArray = [forwardArray,defenseArray,goalieArray];
    return allPlayersArray;
  }

  render() {

    let array = [];
    let forwardArray = [];
    let defenseArray = [];
    let goalieArray = [];
    if (this.props.playerData !== undefined && this.props.playerData.length !== 0) {
      array = this.parseStatData(this.props.playerData);
      forwardArray = array[0];
      defenseArray = array[1];
      goalieArray = array[2];
    }


    const forwardColumns = [{
      Header: 'Forwards',
      accessor: 'name',
      maxWidth:140
    },{
      Header: 'G',
      accessor: 'goals',
      width:30
    },{
      Header: 'A',
      accessor: 'assists',
      width:30
    },{
      Header: 'P',
      accessor: 'points',
      width:30
    },{
      Header: '+/-',
      accessor: 'plusMinus',
      width:30
    },{
      Header: 'SOG',
      accessor: 'shots',
      width:40
    },{
      Header: 'PIM',
      accessor: 'penaltyMinutes',
      width:40
    },{
      Header: 'HITS',
      accessor: 'hits',
      width:50
    },{
      Header: 'TOI',
      accessor: 'timeOnIce',
      width:60
    }];
    const defenseColumns = [{
      Header: 'Defense',
      accessor: 'name',
      width:140// String-based value accessors!
    },{
      Header: 'G',
      accessor: 'goals',
      width:30
    },{
      Header: 'A',
      accessor: 'assists',
      width:30
    },{
      Header: 'P',
      accessor: 'points',
      width:30
    },{
      Header: '+/-',
      accessor: 'plusMinus',
      width:30
    },{
      Header: 'SOG',
      accessor: 'shots',
      width:40
    },{
      Header: 'PIM',
      accessor: 'penaltyMinutes',
      width:40
    },{
      Header: 'HITS',
      accessor: 'hits',
      width:50
    },{
      Header: 'TOI',
      accessor: 'timeOnIce',
      width:60
    }];
    const goalieColumns = [{
      Header: 'Goalies',
      accessor: 'name',
      width:140// String-based value accessors!
    },{
      Header: 'SHOTS',
      accessor: 'shots',
      width:80
    },{
      Header: 'SAVES',
      accessor: 'saves',
      width:80
    },{
      Header: 'SV%',
      accessor: 'savePercentage',
      width:80
    },{
      Header: 'TOI',
      accessor: 'timeOnIce',
      width:80
    }];

    let x = makeTable(forwardColumns,forwardArray);
    return(
      <div className="boxScore">
        <div className="buttonRow">
          <button className={this.props.activeBoxTeam === 'home' ? 'active' : ''} onClick={()=>this.props.onClick('home')}>{this.props.homeTeamName}</button>
          <button className={this.props.activeBoxTeam === 'away' ? 'active' : ''} onClick={()=>this.props.onClick('away')}>{this.props.awayTeamName}</button>
        </div>
        {x}
        <ReactTable
          data={forwardArray}
          columns={forwardColumns}
          resizable={false}
          sortable={false}
          noDataText="No stats available"
          minRows={0}
          showPaginationBottom={false}
        />
        <ReactTable
          data={defenseArray}
          columns={defenseColumns}
          resizable={false}
          sortable={false}
          noDataText="No stats available"
          minRows={0}
          showPaginationBottom={false}
        />
        <ReactTable
          data={goalieArray}
          columns={goalieColumns}
          resizable={false}
          sortable={false}
          noDataText="No stats available"
          minRows={0}
          showPaginationBottom={false}
        />
      </div>
    )
  }
}

function makeTable ( headers, data ) {

  let tableRow = (row) => {
    let rowData = [];

    for ( var key in row ) {
      // Add our row:
      rowData.push(
        <td>{row[key]}</td>
      )
    }

    return (<tr>{rowData}</tr>)
  }

  let tableData = data.map(row => {
    return tableRow(row);
  });

  return (<table>{tableData}</table>);

    // // Check type
    // if ( typeof data !== 'object' ) return false;
    //
    // // Start our HTML
    // var headerRow = '';
    // var dataArray = [];
    // // Loop through members of the object
    // // make header row
    // for ( let i = 0; i <= headers.length-1;i++ ) {
    //   headerRow+=<th>{headers[i].Header}</th>
    // }
    // for ( i = 0; i <= data.length-1;i++ ) {
    //     // https://jslinterrors.com/the-body-of-a-for-in-should-be-wrapped-in-an-if-statement
    //     for ( j = 0; j <= headers.length-1;i++  ) {
    //         // https://jslinterrors.com/the-body-of-a-for-in-should-be-wrapped-in-an-if-statement
    //         // Add our row:
    //         dataArray.push(
    //
    //         )
    //     }
    // }
    // // Finish the table:
    // html += "</tbody></table>";
    // // Return the table
    // return html;
}
