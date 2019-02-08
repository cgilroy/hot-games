import React from 'react';
import RinkSVG from './RinkSVG.js';

export class RinkMap extends React.Component {
  parsePlays(plays) {
    let shotsArray = [];
    for (let i = 0;i<=plays.allPlays.length-1;i++) {
      let playData = plays.allPlays[i];
      if(playData.result.eventTypeId === "FACEOFF" || playData.result.eventTypeId === "FACE-OFF") {
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
      // if(playData.coordinates.x !== "" && playData.team !== undefined) {
      //   let shotData = {
      //     description: playData.result.description,
      //     type: playData.result.eventTypeId,
      //     coordinates: {
      //       x: playData.coordinates.x,
      //       y: playData.coordinates.y,
      //       team: playData.team.name
      //     }
      //   }
      //   let element = (
      //     <g>
      //       <circle cx={shotData.coordinates.x} cy={shotData.coordinates.y} r="1.4"></circle>
      //     </g>
      //   );
      //   shotsArray.push(element);
      // }
    }

    return shotsArray
  }

  render() {

    let shotData = this.parsePlays(this.props.plays);
    return(
      <div className="rinkMap">
        <img src="/resources/rink.png" />
        <svg viewBox="-100 -42.5 200 85" className="shotsSVGData">
          {shotData}
          <g>
            <circle cx='0' cy='40' r="1.4"></circle>
          </g>
          <g>
            <circle cx='0' cy='-40' r="1.4"></circle>
          </g>
          <g>
            <circle cx='-100' cy='0' r="1.4"></circle>
          </g>
          <g>
            <circle cx='100' cy='0' r="1.4"></circle>
          </g>
        </svg>
      </div>
    )
  }
}
