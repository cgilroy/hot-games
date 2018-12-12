import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'

export class BoxScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStatsArray: [],
      goalieStats: []
    }
    this.parseStatData = this.parseStatData.bind(this);
    this.playerArray = [];
  }

  parseStatData(playerData) {
    let players = playerData.players;
    console.log('parseData');
    let keys = Object.keys(players);
    this.playerArray = [];
    // console.log(playerArray);
    for (let i = 0, j = keys.length; i < j; i++) {
      let player = players[keys[i]];
      // console.log(player);
      if (player.stats !== undefined) {

        let playerStats = player.stats;
        let playerType = player.position.type;

        if (playerType === 'Forward') {
          let currentPlayerArray = {
            name: player.person.fullName,
            goals: playerStats.skaterStats.goals,
            assists: playerStats.skaterStats.assists,
            shots: playerStats.skaterStats.shots
          };

          this.playerArray.push(currentPlayerArray);
          // console.log(this.playerArray);
        }

      };

    }

    let statsArray = this.playerArray;
    console.log('statsarray',statsArray);
    this.setState=({playerStatsArray: statsArray}, () => {
      console.log('rightafter',this.state.playerStatsArray);
    });
    console.log('statsarray2',statsArray);

  }



    componentDidMount() {
      // console.log('mountBox');
      if (this.props.playerData !== undefined && this.props.playerData.length !== 0) {
        // if (this.props.team === 'home') {
        //   this.parseStatData(this.props.playerData.home);
        // }else{
        //   this.parseStatData(this.props.playerData.away);
        // }
        this.parseStatData(this.props.playerData);

      }
    }

    componentDidReceiveProps() {
      if (this.props.playerData !== undefined && this.props.playerData.length !== 0) {
        // if (this.props.team === 'home') {
        //   this.parseStatData(this.props.playerData.home);
        // }else{
        //   this.parseStatData(this.props.playerData.away);
        // }
        this.parseStatData(this.props.playerData);
      }
    }


  render() {
    const columns = [{
      Header: 'Name',
      accessor: 'name' // String-based value accessors!
    }, {
      Header: 'G',
      accessor: 'goals'
    }, {
      Header: 'A',
      accessor: 'assists'
    },{
      Header: 'S',
      accessor: 'shots'
    }];

    // console.log(this.state.playerStats);
    // console.table(this.state.playerStats);
    console.log('boxscorestats',this.state.playerStats);
    return(
      <div className="boxScore">
        <ReactTable
          data={this.state.playerStatsArray}
          columns={columns}
          style={{
            height:"250px",
          }}
          noDataText="No stats available"
          minRows={0}
          showPaginationBottom={false}
        />

      </div>
    )
  }
}
