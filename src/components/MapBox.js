import React, { useRef } from 'react'
import Map, { Marker, Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from 'tabler-icons-react';
import { Button, Space, Text } from '@mantine/core';
import mapboxgl from 'mapbox-gl';

export default function MapBox({ display, lat, long, zoom, height, newPin, setNewPin }) {
    // The following is required to stop "npm build" from transpiling mapbox code.
    // notice the exclamation point in the import.
    // @ts-ignore
    // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
    mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
    const mapRef = useRef();

    const handleAddPin = (e) => {
        const { lat, lng } = e.lngLat;
        setNewPin({
            longitude: lng,
            latitude: lat,
        });
    };

    return (
        <Map
            initialViewState={{
                longitude: long || 125.740688,
                latitude: lat || 9.4,
                zoom: zoom || 8,
            }}
            ref={mapRef}
            onViewportChange
            transitionDuration="150"
            style={{ width: '100%', height: height || 535 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            dragRotate={false}
            doubleClickZoom={false}
            onDblClick={!display && handleAddPin}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        >
            <Button size='sm' mt='sm' ml='sm' onClick={() => mapRef.current.flyTo({ center: [long || 125.740688, lat || 9.4], duration: 2000, zoom: zoom || 8 })}> Back to center</Button>

            {display &&
                <Marker
                    latitude={lat}
                    longitude={long}>
                    <MapPin
                        size={40}
                        strokeWidth={2.5}
                        color={'#4067bf'}
                    />
                </Marker>
            }
            {/* Below here is used to create a new pin of a new listing */}
            {!display &&
                newPin &&
                <Popup
                    latitude={newPin.latitude}
                    longitude={newPin.longitude}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setNewPin(null)}
                    anchor="left"
                >
                    <Text size='xs' color='blue'>This is where your listing will be</Text>
                    <Space h="md" />
                    <Text size='xs' color='blue'>Latitude: {newPin.latitude}</Text>
                    <Text size='xs' color='blue'>Longitude: {newPin.longitude}</Text>
                </Popup>
            }
        </Map>
    )
}
