import React from 'react'
import StarSVG from '../resources/star.svg'

function ThreeStars(props) {
  let starLogoPaths=['','',''];
  let firstStarData = props.homeSkaterData["ID"+props.firstStar.id];
  starLogoPaths[0] = props.homeResources.logo;
  if (firstStarData === undefined) {
    firstStarData = props.awaySkaterData["ID"+props.firstStar.id]
    starLogoPaths[0] = props.awayResources.logo;
  }
  let secondStarData = props.homeSkaterData["ID"+props.secondStar.id];
  starLogoPaths[1] = props.homeResources.logo;
  if (secondStarData === undefined) {
    secondStarData = props.awaySkaterData["ID"+props.secondStar.id]
    starLogoPaths[1] = props.awayResources.logo;
  }
  let thirdStarData = props.homeSkaterData["ID"+props.thirdStar.id];
  starLogoPaths[2] = props.homeResources.logo;
  if (thirdStarData === undefined) {
    thirdStarData = props.awaySkaterData["ID"+props.thirdStar.id]
    starLogoPaths[2] = props.awayResources.logo;
  }

  let starData = [firstStarData,secondStarData,thirdStarData];
  let starTables = [];
  let errorPhotos=[];
  for (let i=0;i<=2;i++) {
    let data = starData[i];
    let jsx='';
    if (data.position.code === "G") {
      let savePercentage = (data.stats.goalieStats.shots !== 0) ? (
        +data.stats.goalieStats.saves / +data.stats.goalieStats.shots
      ) : (0);
      savePercentage = savePercentage.toFixed(3);
      errorPhotos.push("https://nhl.bamcontent.com/images/headshots/current/168x168/goalie.jpg");
      jsx = (
        <table>
        <thead>
          <tr>
            <th>SA</th>
            <th>GA</th>
            <th>SV</th>
            <th>SV%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.stats.goalieStats.shots}</td>
            <td>{data.stats.goalieStats.shots-data.stats.goalieStats.saves}</td>
            <td>{data.stats.goalieStats.saves}</td>
            <td>{savePercentage}</td>
          </tr>
        </tbody>
        </table>
      )
    } else {
      errorPhotos.push("https://nhl.bamcontent.com/images/headshots/current/168x168/skater.jpg");
      jsx = (
        <table>
          <thead>
            <tr>
              <th>G</th>
              <th>A</th>
              <th>+/-</th>
              <th>TOI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.stats.skaterStats.goals}</td>
              <td>{data.stats.skaterStats.assists}</td>
              <td>{data.stats.skaterStats.plusMinus}</td>
              <td>{data.stats.skaterStats.timeOnIce}</td>
            </tr>
          </tbody>
        </table>
      )
    }
    starTables.push(jsx);
  }
  return(
    <div className="threeStars">
      <div className="starArea">
        <img src={"https://nhl.bamcontent.com/images/headshots/current/168x168/"+props.firstStar.id+".jpg"} onError={(e)=>{e.target.onerror = null; e.target.src=errorPhotos[0]}} alt='No Photo'/>
        <span className="starName">
          <img src={starLogoPaths[0]} alt='logo' />
          {props.firstStar.fullName}
        </span>
        <div className="starStats">
          {starTables[0]}
        </div>
        <span className="stars">
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
        </span>
      </div>
      <div className="starArea">
        <img src={"https://nhl.bamcontent.com/images/headshots/current/168x168/"+props.secondStar.id+".jpg"} onError={(e)=>{e.target.onerror = null; e.target.src=errorPhotos[1]}} alt='No Photo'/>
        <span className="starName">
          <img src={starLogoPaths[1]} alt='logo'/>
          {props.secondStar.fullName}
        </span>
        <div className="starStats">
          {starTables[1]}
        </div>
        <span className="stars">
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
        </span>
      </div>
      <div className="starArea">
        <img src={"https://nhl.bamcontent.com/images/headshots/current/168x168/"+props.thirdStar.id+".jpg"} onError={(e)=>{e.target.onerror = null; e.target.src=errorPhotos[2]}} alt='No Photo'/>
        <span className="starName">
          <img src={starLogoPaths[2]} alt='logo'/>
          {props.thirdStar.fullName}
        </span>
        <div className="starStats">
          {starTables[2]}
        </div>
        <span className="stars">
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
          <span className="star">
            <img src={StarSVG} alt='star'/>
          </span>
        </span>
      </div>
    </div>
  )
}

export default ThreeStars;
