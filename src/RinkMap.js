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
            x: -playData.coordinates.x,
            y: playData.coordinates.y,
            team: playData.team.name
          },
          player: playData.players[0].player.fullName,
          color: (playData.team.name === this.props.homeResources.teamName) ? (
            this.props.homeResources.primaryColor
          ) : (this.props.awayResources.primaryColor),
          time: playData.about.periodTime.replace(/^0/,'')
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
              <circle  data-tip data-for={"circle"+i} fill-opacity='0' cx={shotData.coordinates.x} cy={shotData.coordinates.y} r="1.4"></circle>
            </g>
          );
          toolTip = (
            <ReactTooltip id={"circle"+i}>
              <span class="tooltipTime">{shotData.time}</span>
              <span class="tooltipInfo">{shotData.player} shot on goal</span>
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
              <span class="tooltipTime">{shotData.time}</span>
              <span class="tooltipInfo">{shotData.description}</span>
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
    let legend = (
      <MapLegend
        homeColor={this.props.homeResources.primaryColor}
        awayColor={this.props.awayResources.primaryColor}
        homeTricode={this.props.homeTricode}
        awayTricode={this.props.awayTricode}
      />
    )
    return(
      <div className="rinkMap">
        <img src="/resources/rink.svg" />
        {output.toolTips}
        <svg viewBox="-100 -42.5 200 85" className="shotsSVGData">
          <clipPath id="logoCircle">
            <circle fill="none" cx="0" cy="0" r="15px"/>
          </clipPath>
          <g>
            <image xlinkHref={this.props.homeResources.imagePath} clip-path="url(#logoCircle)" height="30px" width="30px" opacity="0.5" x='-15' y='-15' borderRadius='15px' ></image>
          </g>
          {output.shotsArray}
        </svg>
        {legend}
      </div>
    )
  }
}

function MapLegend(props) {
  return (
    <div class="legendWrapper">
      <div class="legendHalf">
        <span class="legendTricode">{props.homeTricode}</span>
        <svg viewBox="0 0 2 2" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="0.7" fill={props.homeColor} stroke="#fff" stroke-width="0.3"></circle>
        </svg>
        <span class="legendText">
          <span>Goal</span>
        </span>
        <svg viewBox="0 0 2 2" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="1" cy="1" r="0.7" fill-opacity="0"></circle>
            <line x1="0.30000000000000004" y1="0.30000000000000004" x2="1.7" y2="1.7" stroke-width="0.3" stroke={props.homeColor}></line>
            <line x1="0.30000000000000004" y1="1.7" x2="1.7" y2="0.30000000000000004" stroke-width="0.3" stroke={props.homeColor}></line>
          </g>
        </svg>
        <span class="legendText">
          <span>Shot on Goal</span>
        </span>
      </div>
      <div class="legendHalf">
        <span class="legendTricode">{props.awayTricode}</span>
        <svg viewBox="0 0 2 2" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1" cy="1" r="0.7" fill={props.awayColor} stroke="#fff" stroke-width="0.3"></circle>
        </svg>
        <span class="legendText">
          <span>Goal</span>
        </span>
        <svg viewBox="0 0 2 2" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="1" cy="1" r="0.7" fill-opacity="0"></circle>
            <line x1="0.30000000000000004" y1="0.30000000000000004" x2="1.7" y2="1.7" stroke-width="0.3" stroke={props.awayColor}></line>
            <line x1="0.30000000000000004" y1="1.7" x2="1.7" y2="0.30000000000000004" stroke-width="0.3" stroke={props.awayColor}></line>
          </g>
        </svg>
        <span class="legendText">
          <span>Shot on Goal</span>
        </span>
      </div>
    </div>
  )
}
