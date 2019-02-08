import React from 'react';

export class RinkMap extends React.Component {
  parsePlays(plays) {
    let shotsArray = [];
    for (let i = 0;i<=plays.allPlays.length-1;i++) {
      let playData = plays.allPlays[i];
      if(playData.result.eventTypeId === "SHOT" || playData.result.eventTypeId === "GOAL") {
        let shotData = {
          description: playData.result.description,
          type: playData.result.eventTypeId,
          coordinates: {
            x: playData.coordinates.x,
            y: playData.coordinates.y,
            team: playData.team.name
          }
        }
        let element = (
          <g>
            <circle cx={shotData.coordinates.x} cy={shotData.coordinates.y} r="1.4"></circle>
          </g>
        );
        shotsArray.push(element);
      }
    }

    return shotsArray
  }

  render() {

    let shotData = this.parsePlays(this.props.plays);
    return(
      <div className="rinkMap">
        <svg viewBox="-100 -40 200 80">
          {shotData}
        </svg>
      </div>
    )
  }
}
