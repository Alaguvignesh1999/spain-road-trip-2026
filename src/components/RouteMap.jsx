import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { STOPS } from '../data/trip.js'

function MapController({ coords, zoom = 11, isActive }) {
  const map = useMap()

  useEffect(() => {
    if (!isActive) return undefined

    const id = window.setTimeout(() => {
      map.invalidateSize()
      map.flyTo(coords, zoom, { duration: 0.9, easeLinearity: 0.25 })
    }, 80)

    return () => clearTimeout(id)
  }, [coords, zoom, isActive, map])

  useEffect(() => {
    if (!isActive) return undefined
    const id = window.setTimeout(() => map.invalidateSize(), 120)
    return () => clearTimeout(id)
  }, [isActive, map])

  return null
}

function StopMarker({ stop, isCurrent, onSelectStop }) {
  const color = '#00A3E0'
  const isHotelStop = /hotel|chateau|rooms/i.test(stop.name)
  const size = isCurrent ? 24 : 18

  const icon = useMemo(() => (
    L.divIcon({
      html: `<div class="route-stop-marker${isCurrent ? ' current' : ''}${isHotelStop ? ' hotel' : ''}" style="
        width:${size}px;
        height:${size}px;
        border-color:${isCurrent ? '#ffffff' : '#f3f8ff'};
        background:${isHotelStop ? '#86BC25' : color};
      ">${stop.id + 1}</div>`,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  ), [color, isCurrent, isHotelStop, size, stop.id])

  return (
    <Marker position={stop.coords} icon={icon} eventHandlers={{ click: () => onSelectStop?.(stop.id) }}>
      <Popup>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <strong style={{ fontSize: '14px' }}>Stop {stop.id + 1}: {stop.emoji} {stop.name}</strong>
          <br /><span style={{ color: '#9B7B6E', fontSize: '11px' }}>Day {stop.day} · {stop.region}{isHotelStop ? ' · hotel stay' : ''}</span>
        </div>
      </Popup>
    </Marker>
  )
}

function CarMarker({ coords, carEmoji = '🚗' }) {
  const icon = useMemo(() => (
    L.divIcon({
      html: `<div class="car-map-marker">${carEmoji}</div>`,
      className: '',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    })
  ), [carEmoji])

  return (
    <Marker position={coords} icon={icon} zIndexOffset={1000}>
      <Popup>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600 }}>
          You are here.
        </div>
      </Popup>
    </Marker>
  )
}

export default function RouteMap({
  currentStop,
  onSelectStop,
  isActive = true,
  toneMode = 'day',
  carEmoji = '🚗',
}) {
  const stop = STOPS[currentStop]
  const isDarkMap = toneMode === 'night'
  const tileUrl = isDarkMap
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  return (
    <div className={`map-wrapper${isDarkMap ? ' map-wrapper-dark' : ' map-wrapper-light'}`}>
      <MapContainer
        center={[43.32, -3.5]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl
        scrollWheelZoom={false}
        preferCanvas
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={tileUrl}
        />

        {STOPS.map(s => (
          <StopMarker key={s.id} stop={s} isCurrent={s.id === currentStop} onSelectStop={onSelectStop} />
        ))}

        <CarMarker coords={stop.coords} carEmoji={carEmoji} />

        <MapController coords={stop.coords} zoom={stop.id === 0 || stop.id === 14 ? 11 : 12} isActive={isActive} />
      </MapContainer>
    </div>
  )
}
