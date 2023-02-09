import Header from "./components/Header";
import DiscPanel from "./components/DiscPanel"
import Auth from "./components/Auth"
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

function App() {
  const [ cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [ discs, setDiscs ] = useState(null)

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/discs/${userEmail}`)
      const json = await response.json()
      setDiscs(json)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, [])

  const sortedDiscs = discs?.sort((a,b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <Header userEmail={`${userEmail}'s Discs`} getData={getData}/>
          <div className="disc-grid">
            {sortedDiscs?.map((disc) => <DiscPanel key={disc.id} disc={disc} getData={getData} />)}
          </div>
        </>
      }
    </div>
  );
}

export default App;
