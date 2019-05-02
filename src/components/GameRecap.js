import React from 'react'

function GameRecap(props) {
  let item = props.content.editorial.recap.items[0];
  let headline = item.headline;
  let subhead = item.subhead;
  let imgSrc = item.media.image.cuts['1136x640'].src;
  let description = item.preview;
  let bgImg = {backgroundImage:"url("+imgSrc+")"};
  return (
    <div className="gameRecap">
      <div className="blurb">
        <h1>{headline}</h1>
        <h2>{subhead}</h2>
      </div>

        <img src={imgSrc} style={{width:'100%'}} alt=''/>
        <div className="description" dangerouslySetInnerHTML={{__html:description}}></div>
    </div>
  )
}

export default GameRecap
