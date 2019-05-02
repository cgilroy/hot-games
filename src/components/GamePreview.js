import React from 'react'

function GamePreview(props) {
  let item = props.content.editorial.preview.items[0];
  let imgSrc = item.media.image.cuts['1136x640'].src;
  let description = item.preview;
  return (
    <div className="gamePreview">
      <div className="heroImage">
        <img src={imgSrc} alt=''/>
        <div className="description" dangerouslySetInnerHTML={{__html:description}}></div>
      </div>
    </div>
  )
}

export default GamePreview
