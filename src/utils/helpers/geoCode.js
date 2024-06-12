export async function geocodeLatLng(latlng) {
  try {
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({
      location: latlng,
    });

    // Iterate through address components to find the city
    let city = null;
    response.results.forEach((result) => {
      result.address_components.forEach((component) => {
        if (component.types.includes("locality")) {
          // Check if the component is the locality (city)
          city = component.long_name;
        }
      });
    });

    // If city is still null, try to get it from the first result's formatted address
    if (!city && response.results.length > 0) {
      city = response.results[0].formatted_address;
    }

    const last = response.results.length - 1;
    let country = response.results[last].formatted_address;

    console.log(response.results);
    return {address: response.results[1].formatted_address, country: country, city: city}
  } catch (error) {
    console.log("Geocoder failed due to: " + error);
    return null;
  }
}

export async function reverseGeocodeLatLng(latlng) {
  try {
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({
      location: latlng,
    });

    let city = null;
    response.results.forEach((result) => {
      result.address_components.forEach((component) => {
        if (component.types.includes("locality")) {
          // Check if the component is the locality (city)
          city = component.long_name;
        }
      });
    });

    // If city is still null, try to get it from the first result's formatted address
    if (!city && response.results.length > 0) {
      city = response.results[0].formatted_address;
    }

    const last = response.results.length - 1;
    let country = response.results[last].formatted_address;
    const res = {
      country: country,
      city: city,
      address: response.results[1].formatted_address,
    };

    return res;
  } catch (error) {
    console.log("Geocoder failed due to: " + error);
    return null;
  }
}
