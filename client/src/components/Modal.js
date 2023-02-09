import DiscImg from './DiscImg'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

function Modal({ mode, setShowModal, getData, disc }) {
  const [ cookies, setCookie, removeCookie ] = useCookies()

  // Search
  const [ searchTerm, setSearchTerm ] = useState("")
  const [ searchResults, setSearchResults ] = useState([])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    const searchUrl = `https://discit-api.fly.dev/disc?name=${e.target.value}`
    returnMatches(searchUrl)
  }

  const returnMatches = async (url) => {
    try {
      const response = await fetch(url)
      const json = await response.json()
      const data = json.slice(0,9)
      console.log(data)
      setSearchResults(data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = async (disc) => {
    disc.user_email = cookies.Email
    disc.date = (new Date()).toString()
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/disc`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disc)
      })
      if (response.status === 200) {
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.log(err)
    }
  }

  // Edit
  const [ formStatus, setFormStatus ] = useState(false)
  const [ fileName, setFileName ] = useState(null)
  const [ postImage, setPostImage ] = useState({
    myFile: "",
  })

  const createPost = async (post) => {
    console.log(post)
    try {
      await fetch(`${process.env.REACT_APP_SERVERURL}/disc/${disc.id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createPost(postImage)
    getData()
    setFileName("")
    toggleFormStatus()
  }

  const resizeImg = (file) => {
    const resize_width = 200;

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.size = e.target.size
        img.onload = (el) => {
          const canvas = document.createElement('canvas')
          
          const scaleFactor = resize_width / el.target.width
          canvas.width = resize_width
          canvas.height = el.target.height * scaleFactor

          const ctx = canvas.getContext('2d')
          ctx.drawImage(el.target, 0, 0, canvas.width, canvas.height)
          const srcEncoded = ctx.canvas.toDataURL('image/png', 1)
          resolve(srcEncoded)
        }
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name)
    const base64 = await resizeImg(file)
    setPostImage({ ...postImage, myFile: base64 })
  }

  // Delete
  const deleteDisc = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/disc/${disc.id}`, {
        method: "DELETE",
      })
      if (response.status === 200) {
        setShowModal(false)
        getData()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const toggleFormStatus = () => {
    if (formStatus === false) {
      setFormStatus(true)
    } else {
      setFormStatus(false)
    }
  }


  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          {mode === "create" ? <h3>Add a disc to your bag</h3> : <h3>Edit your disc</h3>}
          <button onClick={() => setShowModal(false)}>X</button>
        </div>
        {mode === "create" ?
          <div className="search">
            <input 
              required
              placeholder="Search a disc by name" 
              name="serchDisc"
              value={searchTerm}
              onChange={handleChange}
            />
            {searchTerm === "" ? <ul><li>No results...</li></ul>: 
            <ul>
              {searchResults.map((disc) => <li 
                onClick={() => handleClick(disc)}
                key={disc.id}><span>{disc.brand}</span><span>{disc.name}</span>
              </li>)}  
            </ul>}
          </div>
        : 
        <>
          <div className="card info" onMouseUp={() => setShowModal(true)}>
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
            </div>
          </div>
          <div className='button-container modal-buttons'>
            <button 
              className='warning'
              onClick={toggleFormStatus}
            >Edit your disc image</button>
            <button 
              className='danger'
              onClick={deleteDisc}
            >Delete disc</button>
          </div>
          {formStatus && 
          <div>
            <form className="image-submit" onSubmit={handleSubmit}>
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  name="myFile"
                  accept=".jpeg, .png, .jpg"
                  onChange={(e) => handleFileUpload(e)}
                />
                {!fileName ? "Upload an image of your disc" : fileName} 
              </label>
              <button>Submit</button>
            </form>
          </div>}
        </>
        }
        
      </div>
    </div>
  );
}

export default Modal