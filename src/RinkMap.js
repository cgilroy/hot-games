import React from 'react';
import * as ReactDOM from "react-dom";
import RinkSVG from './RinkSVG.js';
import ReactTooltip from 'react-tooltip';

export class RinkMap extends React.Component {
  parsePlays(plays) {
    let shotsArray = [];
    let toolTips = [];
    for (let i = 0;i<=plays.allPlays.length-1;i++) {
      let playData = plays.allPlays[i];

      if(playData.result.eventTypeId === "SHOT" || playData.result.eventTypeId === "GOAL") {
        let shotData = {
          description: playData.result.description,
          type: playData.result.eventTypeId,
          coordinates: {
            x: playData.coordinates.x,
            y: -playData.coordinates.y,
            team: playData.team.name
          },
          player: playData.players[0].player.fullName,
          color: (playData.team.name === this.props.homeResources.teamName) ? (
            this.props.homeResources.primaryColor
          ) : (this.props.awayResources.primaryColor),
          time: playData.about.periodTime
        }
        if (playData.about.period % 2 == 0) {
          shotData.coordinates.x = -shotData.coordinates.x;
          shotData.coordinates.y = -shotData.coordinates.y;
        }
        let element = '';
        let toolTip = '';
        if (shotData.type === "SHOT") {
          element = (
            <g>
              <line x1={shotData.coordinates.x - 1.4} y1={shotData.coordinates.y + 1.4} x2={shotData.coordinates.x + 1.4} y2={shotData.coordinates.y - 1.4} stroke-width="0.6" stroke={shotData.color}></line>
              <line x1={shotData.coordinates.x - 1.4} y1={shotData.coordinates.y - 1.4} x2={shotData.coordinates.x + 1.4} y2={shotData.coordinates.y + 1.4} stroke-width="0.6" stroke={shotData.color}></line>
              <circle  data-tip data-for={"circle"+i} fill-opacity='0' cx={shotData.coordinates.x} cy={shotData.coordinates.y} r="3"></circle>
            </g>
          );
          toolTip = (
            <ReactTooltip id={"circle"+i}>
              <span>{shotData.time}</span>
              <span>{shotData.player} Shot On Goal</span>
            </ReactTooltip>
          );
        } else {
          element = (
            <g>
              <circle data-tip data-for={"circle"+i} cx={shotData.coordinates.x} cy={shotData.coordinates.y} r="1.4" fill={shotData.color} stroke='#fff' stroke-width="0.6"></circle>
            </g>
          );
          toolTip = (
            <ReactTooltip id={"circle"+i}>
              <span>{shotData.time}</span>
              <span>{shotData.description}</span>
            </ReactTooltip>
          );
        }

        shotsArray.push(element);
        toolTips.push(toolTip);
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

    return ({
      shotsArray,
      toolTips
  })
}

componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  render() {

    let output = this.parsePlays(this.props.plays);
    return(
      <div className="rinkMap">
        <img src="/resources/rink.svg" />
        {output.toolTips}
        <svg viewBox="-100 -42.5 200 85" className="shotsSVGData">

          {output.shotsArray}
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
