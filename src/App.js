import { useEffect, useState } from 'react';
import './App.css';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star, StarBorder } from "@material-ui/icons";
import axios from "axios";
import {format} from "timeago.js"

function App() {
  const [pins,setPins]=useState([]);
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
  return (
   <div className="App"> 
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {pins.map((p)=>(
        <>
        <Marker 
        latitude={p.lat}
         longitude={p.long}
          offsetLeft={-20} 
          offsetTop={-10}>
        <Room style={{fontSize:viewport.zoom *8,color:'slateblue'}}/>
        </Marker>
        <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            
            anchor="left" >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p>{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              </div>
              <label>Information</label>
              <span className="username">Created By <b>{p.username}</b></span>
              <span className="date">{format(p.createdAt)}</span>
            </div>
          </Popup>
          </>
      ))}
      
      </ReactMapGL>
    </div>
  );
}

export default App;
