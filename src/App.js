import { useEffect, useState } from 'react';
import './App.css';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star, StarBorder } from "@material-ui/icons";
import axios from "axios";
import {format} from "timeago.js"
import Register from "./components/Register";
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins,setPins]=useState([]);
  const [currentPlaceId,setCurrentPlaceId]=useState(null);
  const [newPlace,setNewPlace]=useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 20.5937,
    longitude:78.9629,
    zoom: 4
  });

  useEffect(()=>{
const getPins=async ()=>{
  try{
 const res=await axios.get("https://foodiemebackend.herokuapp.com/api/pins");
 console.log(res.data);
 setPins(res.data);

  }catch(err){
    console.log(err)
  }
}
getPins()
  },[])

  const handleMarkerClick = (id,lat,long) =>{
    setCurrentPlaceId(id);
    setViewport({...viewport,lat,long})

  }

  const handleAddClick=(e)=>{
    const [long,lat]=e.lngLat;
    setNewPlace({
      lat,
      long
    })
  }
  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    const newPin={
      username:currentUsername,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }
    try{
      const res=await axios.post("https://foodiemebackend.herokuapp.com/api/pins",newPin);
      console.log(res);
      setPins([...pins,res.data]);
      setNewPlace(null);
    }catch(err){
      console.log(err);
    }
  }
  return (
   <div className="App"> 
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={handleAddClick}
      transitionDuration="200"
    >
      {pins.map((p)=>(
        <>
        <Marker 
        latitude={p.lat}
         longitude={p.long}
          offsetLeft={-3.5 * viewport.zoom} 
          offsetTop={viewport.zoom *8}>
        <Room style={{fontSize:viewport.zoom *8,color:p.username===currentUsername?'tomato':'blue',cursor:"pointer"}}
        onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
        />
        </Marker>
        {p._id== currentPlaceId && (
        <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            
            anchor="left" 
            onClose={()=>setCurrentPlaceId(null)}
            >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p>{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
              {Array(p.rating).fill(<Star className="star" />)}
             
              </div>
              <label>Information</label>
              <span className="username">Created By <b>{p.username}</b></span>
              <span className="date">{format(p.createdAt)}</span>
            </div>
          </Popup>
        )}
          </>
      ))}


{newPlace && (
 <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            
            anchor="left" 
            onClose={()=>setNewPlace(null)}
            >
             <div>
               <form onSubmit={handleSubmit}>
                 <label>Title</label>
                 <input
                  placeholder="Enter the Title"
                  onChange={(e)=>setTitle(e.target.value)}/>
                 <label>Review</label>
                 <textarea
                  placeholder="How is this place"
                  onChange={(e)=>setDesc(e.target.value)}
                  />
                 <label>Rating</label>
                 <select>
                   <option value="1">1</option>
                   <option value="2">2</option>
                   <option value="3">3</option>
                   <option value="4">4</option>
                   <option value="5">5</option>
                 </select>
                <button className="submitButton" type="submit">Add Pin</button>


               
               </form>
             </div>

 </Popup>

)}
 {currentUsername ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
         {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
