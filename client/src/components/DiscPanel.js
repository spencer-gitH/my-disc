import Modal from './Modal'
import { useState } from 'react'
import DiscImg from './DiscImg'

function DiscPanel({ disc, getData }) {
  const [showModal, setShowModal] = useState(false)

  if (showModal === true) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "auto"
  }
  
  return (
    <div className="card" onMouseUp={() => setShowModal(true)}>
      <DiscImg src={disc.img_encoded}/>
      <div className="disc-description">
        <span>{disc.stability}</span>
        <span>{disc.category}</span> 
      </div>
      <div className="disc-name">
        <span className="brand">{disc.brand}</span>
        <span className="name">{disc.disc_name}</span>  
      </div>
      <div className="disc-numbers">
        <div>
          <div className="attribute">Speed</div>
          <div className="number">{disc.speed}</div>
        </div>
        <div>
          <div className="attribute">Glide</div>
          <div className="number">{disc.glide}</div>
        </div>
        <div>
          <div className="attribute">Turn</div>
          <div className="number">{disc.turn}</div>
        </div>
        <div>
          <div className="attribute">Fade</div>
          <div className="number">{disc.fade}</div>
        </div>
        {/* <button>edit</button> */}
      </div>
      {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} disc={disc} />}
    </div>
  )
}

export default DiscPanel;