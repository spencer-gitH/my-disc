import Modal from './Modal'
import { useState } from 'react'
import { useCookies } from 'react-cookie';

function Header({userEmail, getData}) {
  const [ cookies, setCookie, removeCookie] = useCookies(null)
  const [showModal, setShowModal] = useState(false)

  const signOut = () => {
    console.log('signout')
    removeCookie('Email')
    removeCookie('AuthToken')

    window.location.reload()
  }

  if (showModal === true) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "auto"
  }


  return (
    <div className="list-header">
      <h1>{userEmail}</h1>
      <div className="button-container">
        <button className="info" onClick={() => setShowModal(true)}>ADD DISC</button>
        <button className="danger" onClick={signOut}>SIGN OUT</button>
      </div>
      {showModal && <Modal mode={'create'} setShowModal={setShowModal} getData={getData} />}
    </div>
  );
}

export default Header;