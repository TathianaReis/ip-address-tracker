const geoData = document.querySelector(".geo_data");
const formElement = document.getElementById("formData");

const map = L.map("map");

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const whereAmI = function (e) {
  const apiKey = "at_u5tm36kw5EDRaXcaxvaOEDbjULFD5";
  const searchInput = document.getElementById("searchBox").value;

  fetchIpData(apiKey, searchInput, e);
};

const renderError = function (msg) {
  geoData.innerHTML = "";

  let html = `
      <ul>
          <li>                 
              <span>${msg}</span>
          </li>
     </ul>
    `;
  geoData.insertAdjacentHTML("afterbegin", html);
};

const fetchIpData = async function (apiKey, searchInput, e) {
  if (e) e.preventDefault();

  try {
    const resGeo = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${searchInput}&domain=${searchInput}`
    );
    if (!resGeo.ok)
      throw new Error(
        `Problem getting location data. (API response status: ${resGeo.statusText})`
      );

    const dataGeo = await resGeo.json();
    const { lat, lng } = dataGeo.location;
    renderHTML(dataGeo);
    renderMap([lat, lng]);
  } catch (err) {
    renderError(`${err.message}`);
  }
};

const renderHTML = function (data) {
  geoData.innerHTML = "";

  let html = `
      <ul>
          <li>
              <h2>IP ADDRESS</h2>           
              <span>${data.ip}</span>
          </li>
          <li>
              <h2>LOCATION</h2>            
              <span>${data.location.region}, ${data.location.city} ${data.location.postalCode}</span>
          </li>
          <li>
              <h2>TIMEZONE</h2>          
              <span>UTC ${data.location.timezone}</span>
          </li>
          <li>
              <h2>ISP</h2>            
              <span>${data.isp}</span>
          </li>
      </ul>
      `;

  geoData.insertAdjacentHTML("afterbegin", html);
};

const renderMap = function (coords) {
  console.log(coords);

  map.setView(coords, 13);

  const marker = L.marker(coords)
    .addTo(map)
    .bindPopup("You are here.")
    .openPopup();
};

const popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

whereAmI();

formElement.addEventListener("click", whereAmI);
