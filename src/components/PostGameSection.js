import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SimpleBar from 'simplebar-react';

export class PostGameSection extends React.Component {

    createSection = (data) => {


    }
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

    return(
      <div className="boxScore">
        <SimpleBar style={{height:'240px'}}>
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
        </SimpleBar>
      </div>
    )
  }
}
