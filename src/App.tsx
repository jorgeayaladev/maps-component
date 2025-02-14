import { useEffect, useState } from "react"
import { Map, tileLayer, marker } from "leaflet"

function App() {
  const [info, setInfo] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
  })

  useEffect(() => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude

          const myMap = new Map("map").setView([latitude, longitude], 15)

          tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
            maxZoom: 20,
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
          }).addTo(myMap)

          marker([latitude, longitude])
            .addTo(myMap)
            .bindPopup("A pretty CSS popup.<br> Easily customizable.")
            .openPopup()

          console.log(position.coords)

          setInfo({
            latitude,
            longitude,
            altitude: position.coords.altitude || 0,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy || 0,
            heading: position.coords.heading || 0,
            speed: position.coords.speed || 0,
          })
        },
        (error) => {
          console.error("Error obtaining location:", error.message)
        },
        {
          enableHighAccuracy: true, // Requests the most accurate location
          timeout: 10000, // Maximum time (in ms) to wait for location
          maximumAge: 0, // No cached location, always get fresh data
        }
      )

      return () => navigator.geolocation.clearWatch(watcher)
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen">
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-cyan-200 rounded-lg">
          <h1 className="text-center font-bold text-xl">Mi ubicación</h1>
          <ul>
            <li>Latitud: {info.latitude}</li>
            <li>Longitud: {info.longitude}</li>
            <li>Altitud: {info.altitude}</li>
            <li>Precisión: {info.accuracy}</li>
            <li>Altitud de precisión: {info.altitudeAccuracy}</li>
            <li>Dirección: {info.heading}</li>
            <li>Velocidad: {info.speed}</li>
          </ul>
        </div>
      </div>
      <div id="map" className="h-full"></div>
    </div>
  )
}

export default App
