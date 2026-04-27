import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { STOPS, ROUTES } from '../data/trip'

// Animated map panning when stop changes
function MapController({ coords, zoom = 11 }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(coords, zoom, { duration: 1.4, easeLinearity: 0.4 })
  }, [coords, map, zoom])
  return null
}

// Tiny stop marker
function StopMarker({ stop, isCurrent }) {
  const day   = [1,2,3,4].find(d => STOPS.filter(s => s.day === d).find(s => s.id === stop.id))
  const color = ROUTES[stop.day]?.color ?? '#888'

  const icon = L.divIcon({
    html: `<div style="
      width:${isCurrent ? 18 : 10}px;
      height:${isCurrent ? 18 : 10}px;
      background:${color};
      border:${isCurrent ? '3px' : '2px'} solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      transition:all 0.3s;
    "></div>`,
    className: '',
    iconSize:   [isCurrent ? 18 : 10, isCurrent ? 18 : 10],
    iconAnchor: [isCurrent ? 9  : 5,  isCurrent ? 9  : 5],
  })

  return (
    <Marker position={stop.coords} icon={icon}>
      <Popup>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
          <strong style={{ fontSize: '14px' }}>{stop.emoji} {stop.name}</strong>
          <br /><span style={{ color: '#9B7B6E', fontSize: '11px' }}>Day {stop.day} · {stop.region}</span>
        </div>
      </Popup>
    </Marker>
  )
}

// Animated car at current stop
function CarMarker({ coords }) {
  const icon = L.divIcon({
    html: `<div class="car-map-marker">🚗</div>`,
    className: '',
    iconSize:   [38, 38],
    iconAnchor: [19, 19],
  })
  return (
    <Marker position={coords} icon={icon} zIndexOffset={1000}>
      <Popup>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600 }}>
          You are here! 📍
        </div>
      </Popup>
    </Marker>
  )
}

export default function RouteMap({ currentStop }) {
  const stop = STOPS[currentStop]

  // Day colour config
  const dayColors = {
    1: { color: '#C8533A', weight: 4, dashArray: null },
    2: { color: '#3D6B55', weight: 4, dashArray: null },
    3: { color: '#6B4F9E', weight: 4, dashArray: null },
    4: { color: '#C87A2A', weight: 4, dashArray: null },
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[43.32, -3.5]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Per-day route polylines */}
        {Object.entries(ROUTES).map(([day, route]) => (
          <Polyline
            key={day}
            positions={route.coords}
            pathOptions={{
              color:     route.color,
              weight:    Number(day) === stop.day ? 5 : 3,
              opacity:   Number(day) === stop.day ? 0.95 : 0.45,
              dashArray: Number(day) === stop.day ? null : '6 4',
              lineCap:   'round',
              lineJoin:  'round',
            }}
          />
        ))}

        {/* All stop markers */}
        {STOPS.map(s => (
          <StopMarker key={s.id} stop={s} isCurrent={s.id === currentStop} />
        ))}

        {/* Animated car at current position */}
        <CarMarker coords={stop.coords} />

        {/* Fly to current stop */}
        <MapController coords={stop.coords} zoom={stop.id === 0 || stop.id === 14 ? 11 : 12} />
      </MapContainer>
    </div>
  )
}
