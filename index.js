let latitude1;
let longtidute1;
let data1 = {};
let language = 'en';
let temperaryName;

const loading = function () {
  document.querySelector(
    '.display-location'
  ).innerHTML = ` <img class="rotate" src="loading.png" height="100px" width="100px" />`;
};

const weaterDisplay = async function () {
  try {
    const res =
      await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude1}&lon=${longtidute1}&units=metric&lang=${language}&appid=020ac55b2fd50a0cf8bf0e75f7351e9b
`);
    const data = await res.json();
    if (!res.ok) throw new Error('faild');

    return data;
  } catch (err) {
    console.log(err);
  }
};
const countryData = async function () {
  try {
    const Weather = await weaterDisplay();
    const code = Weather.sys.country;
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const coords = [latitude, longitude];
    const map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot//{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(coords).addTo(map).bindPopup(`location`).openPopup();

    const callData = async function () {
      loading('loading...');
      const data = await weaterDisplay();
      const country = await countryData();
      temperaryName = data.description;
      const icone = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      console.log(data);
      const lang = {
        english: `
       <div class="data">
       <img class="image-flag" src="${country[0].flags.png}" alt="flag" />
       <div class="flex">
       <p>City: ${data.name}</p>
      <p class="temperture">current Temperture: ${Math.round(
        data.main.temp
      )}</p>
      </div>
      <div class="flex">
      <p>feels like: ${Math.ceil(data.main.feels_like)}</p>
      <p>humidity: ${data.main.humidity}</p>
      </div>
      <div class="flex">
      <p>wind Speed ${data.wind.speed} meters per second</p>
      <p>weather description: ${data.weather[0].description}</p>
      </div>
      <img src="${icone}" alt="icone"/>
       <data>
       `,
        arabic: `
        <div class="data">
        <img class="image-flag" src="${country[0].flags.png}" alt="flag" />
        <p>مدينه: ${data.name}</p>
       <p class="temperture">current Temperture: ${Math.round(
         data.main.temp
       )}</p>
       <p>احساس درجه الحراره: ${Math.ceil(data.main.feels_like)}</p>
       <p>يوحد: ${data.weather[0].description}</p>
       <img src="${icone}" alt="icone"/>
        <data>
       `,
        french: `
       <div class="data">
       
       <p>emplacement: ${data.name}</p>
       <p>Température: ${Math.ceil(data.main.temp)}</p>
       <p>se sent comme: ${Math.ceil(data.main.feels_like)}</p>
       <p>la description: ${data.weather[0].description}</p>
       <img src="${icone}" alt="icone"/>
       <data>
       `,
      };

      switch (language) {
        case 'en':
          document.querySelector('.display-location').innerHTML = lang.english;
          break;
        case 'ar':
          document.querySelector('.display-location').innerHTML = lang.arabic;
          break;
        case 'fr':
          document.querySelector('.display-location').innerHTML = lang.french;
        default:
          break;
      }
    };

    const handler = async function () {
      const results = await weaterDisplay();
      data1 = {
        name: results.name,
        temperture: Math.ceil(results.main.temp_max),
        feelsLike: Math.ceil(results.main.feels_like),
        description: results.weather[0].description,
      };
    };

    map.on('click', function (mapEvent) {
      const { lat, lng } = mapEvent.latlng;
      latitude1 = lat;
      longtidute1 = lng;
      callData();
      handler();
      
      setTimeout(function () {
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            `
        ${data1.name}
        ${data1.temperture}
        ${data1.description}
      `
          )
          .openPopup();
      }, 900);
    });
  });
}

