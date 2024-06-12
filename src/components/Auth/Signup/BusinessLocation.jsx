import React, { useCallback, useEffect, useRef, useState } from "react";
import css from "./Signup.module.scss";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import {
  geocodeLatLng,
  reverseGeocodeLatLng,
} from "../../../utils/helpers/geoCode";
import { useSelector } from "react-redux";
import pin from "@/assets/pin.png";
import { ErrorMessage, Field } from "formik";
import { Button } from "@nextui-org/react";
import _ from "lodash";

const bounds = {
  east: -110,
  north: 40,
  south: 35,
  west: -120,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const divStyle = {
  background: `white`,
  padding: 5,
  width: "auto",
};

// Default location (latitude and longitude of New York City)
const defaultLocation = { lat: 40.7128, lng: -74.0060 };

const BusinessLocation = ({
  errors,
  touched,
  setFieldValue,
  setIsAddressError,
}) => {
  const { isLoaded } = useSelector((state) => state.auth);
  const [searchBox, setSearchBox] = useState(null);
  const [searchBoxBounds, setSearchBoxBounds] = useState(null);
  const [selectedVal, setSelectedVal] = useState("");
  const [infoWindow, setInfoWindow] = useState(null);
  const [mapCenter, setMapCenter] = useState();
  const [mapRef, setMapRef] = useState(defaultLocation);
  const inputRef = useRef();
  const [isConfirmButton, setIsConfirmButton] = useState(false);
   const [locationError, setLocationError] = useState(false);

   const getLocation = () => {
     navigator.geolocation.getCurrentPosition(
       (position) => {
         setMapCenter({
           lat: position.coords.latitude,
           lng: position.coords.longitude,
         });
         setLocationError(false);
       },
       () => {
         setLocationError(true);
       }
     );
   };

   useEffect(() => {
     getLocation();
     const intervalId = setInterval(() => {
      if (locationError){
        getLocation();
      } 
     }, 4000); // Retry every 4 seconds

     return () => clearInterval(intervalId);
   }, []);

//   useEffect(
//     () =>
//       navigator.geolocation.getCurrentPosition((position) => {
//         setMapCenter({
//           lat: position?.coords?.latitude,
//           lng: position?.coords?.longitude,
//         });
//       }),
//     []
//   );

  const onLoadSearchBox = (ref) => {
    setSearchBox(ref);
  };

  async function onPlacesChanged() {
    const places = searchBox.getPlaces();
    if (places.length > 0) {
      const selectedPlace = places[0];

      if (selectedPlace.geometry && selectedPlace.geometry.viewport) {
        // Update map bounds to fit the selected place
        const viewport = selectedPlace.geometry.viewport;
        setSearchBoxBounds({
          east: viewport.getNorthEast().lng(),
          north: viewport.getNorthEast().lat(),
          south: viewport.getSouthWest().lat(),
          west: viewport.getSouthWest().lng(),
        });

        const location = selectedPlace.geometry.location;
        mapRef.panTo({ lat: location.lat(), lng: location.lng() });
        const latLng = { lat: location.lat(), lng: location.lng() };
        const res = await reverseGeocodeLatLng(latLng);
        setSelectedVal(selectedPlace.formatted_address);
        setFieldValue("latLng", `${location.lat()},${location.lng()}`);
        setFieldValue("address", selectedPlace.formatted_address);
        setFieldValue("country", res.country);
        setFieldValue("city", res.city);
        setIsAddressError(false);
      }
    }
  }

  const handleChange = (e) => {
    setSelectedVal(e.target.value);
  };

  const handleDragEnd = ()=>{
    if(mapRef){
        setIsConfirmButton(true);
    }
  }

  const handleConfirmLocation = async()=>{
      setIsConfirmButton(false);
    const res = await geocodeLatLng(mapRef.getCenter());
    
    setSelectedVal(res.address);
    setFieldValue("latLng", mapRef.getCenter());
    setFieldValue("address", res.address);
    setFieldValue("country", res.country);
    setFieldValue("city", res.city);
  }

    const debouncedCenterChanged = useCallback(
      _.debounce(() => {
        setMapCenter(mapRef.getCenter());
      }, 100),
      [mapRef]
    );

  return (
    <>
      <div className="w-full">
        <StandaloneSearchBox
          bounds={searchBoxBounds || bounds}
          onLoad={onLoadSearchBox}
          onPlacesChanged={() => onPlacesChanged()}
        >
          <Field
            innerRef={inputRef}
            type="text"
            id="address"
            name="address"
            placeholder="Enter business address"
            className={errors.address && touched.address && "inputBottomBorder"}
            value={selectedVal}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </StandaloneSearchBox>
      </div>

      <div
        style={{
          margin: "13px auto",
          height: "150px",
          width: "99%",
          borderRadius: "15px",
        }}
      >
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={15}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              zoomControl: true,
            }}
            onLoad={(map) => {
              setMapRef(map);
            }}
            onIdle={() => setMapCenter(mapRef.getCenter())}
            // onCenterChanged={debouncedCenterChanged}
            onDragEnd={handleDragEnd}
          >
            <Marker position={mapCenter} icon={pin} />

            {isConfirmButton && (
              <div className="absolute bottom-4 right-16">
                <Button
                  onClick={handleConfirmLocation}
                  color="primary"
                  size="sm"
                >
                  Confirm Location
                </Button>
              </div>
            )}

            {infoWindow && (
              <InfoWindow position={mapCenter}>
                <div style={divStyle}>
                  <p>{infoWindow}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default BusinessLocation;
