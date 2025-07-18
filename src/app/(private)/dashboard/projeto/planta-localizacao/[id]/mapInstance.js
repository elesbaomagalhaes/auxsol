mapInstance.addListener('click', (event) => {
  const clickedLat = event.latLng?.lat();
  const clickedLng = event.latLng?.lng();
  
  // Criar marcador na posição clicada
  const newMarker = new google.maps.Marker({
    position: coordinates,
    map: mapInstance,
    icon: customPinIcon
  });
});