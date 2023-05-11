var apiKey = "80caa41db0edd8369034c8c99078f086";

var citiesArr = [];
var cityList = $("#city-list");

function formatDay(date) {
  if (!date) {
    return "";
  }
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dayOutput =
    date.getFullYear() +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    (day < 10 ? "0" : "") +
    day;
  return dayOutput;
}

init();

function init() {
  var storedCities = JSON.parse(localStorage.getItem("citiesArr"));

  if (storedCities !== null) {
    citiesArr = storedCities;
  }

  renderCities();
}

function storeCities() {
  localStorage.setItem("citiesArr", JSON.stringify(citiesArr));
}

function renderCities() {
  cityList.empty();

  for (var i = 0; i < citiesArr.length; i++) {
    var city = citiesArr[i];

    var li = $("<li>").text(city);
    li.attr("id", "listC");
    li.attr("data-city", city);
    li.attr("class", "list-group-item");
    cityList.prepend(li);
  }

  if (!city) {
    return;
  } else {
    getResponseWeather(city);
  }
}

$("#add-city").on("click", function (event) {
  event.preventDefault();

  var city = $("#city-input").val().trim();

  if (city === "") {
    return;
  }

  citiesArr.push(city);

  storeCities();
  renderCities();
});

function getResponseWeather(cityName) {
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  $("#today-weather").empty();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    cityTitle = $("<h3>").text(response.name + " " + formatDay());
    $("#today-weather").append(cityTitle);

    var TempetureToNum = parseInt(response.main.temp * 9 / 5 - 459);
    var cityTemperature = $("<p>").text("Tempeture: " + TempetureToNum + " °F");
    $("#today-weather").append(cityTemperature);

    var cityHumidity = $("<p>").text("Humidity: " + response.main.humidity + " %");
    $("#today-weather").append(cityHumidity);

    var cityWindSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#today-weather").append(cityWindSpeed);

    var CoordLon = response.coord.lon;
    var CoordLat = response.coord.lat;


    fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${CoordLat}&lon=${CoordLon}`)
    .then(response => response.json())
    .then(responseuv => {
        const cityUV = document.createElement('span');
        cityUV.textContent = responseuv.value;

        const cityUVp = document.createElement('p');
        cityUVp.textContent = 'UV Index: ';
        cityUVp.appendChild(cityUV);

        const todayWeather = document.querySelector('#today-weather');
        todayWeather.appendChild(cityUVp);

        console.log(typeof responseuv.value);

        if (responseuv.value > 0 && responseuv.value <= 2) {
            cityUV.classList.add('text-success');
        } else if (responseuv.value > 2 && responseuv.value <= 5) {
            cityUV.classList.add('text-primary');
        } else if (responseuv.value > 5 && responseuv.value <= 7) {
            cityUV.classList.add('text-warning');
        } else if (responseuv.value > 7 && responseuv.value <= 10) {
            cityUV.classList.add('text-danger');
        } else {
            cityUV.classList.add('purple');
        }
    });


   
    const queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    fetch(queryURL3)
        .then(response => response.json())
        .then(response5day => {
            $("#boxes").empty();
            console.log(response5day);
            for (var i = 0, j = 0; j <= 5; i = i + 6) {
                var read_date = response5day.list[i].dt;
                if (response5day.list[i].dt != response5day.list[i + 1].dt) {
                    var FivedayDiv = $("<div>");
                    FivedayDiv.attr("class", "col-3 m-2 bg-primary")
                    var d = new Date(0);
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        (day < 10 ? '0' : '') + day;
                    var Fivedayh4 = $("<h6>").text(dayOutput);
                   
                    var imgtag = $("<img>");
                    var skyconditions = response5day.list[i].weather[0].main;
                    if (skyconditions === "Clouds") {
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if (skyconditions === "Clear") {
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    } else if (skyconditions === "Rain") {
                        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }
    
                    var pTemperatureK = response5day.list[i].main.temp;
                    console.log(skyconditions);
                    var TempetureToNum = parseInt((pTemperatureK) * 9 / 5 - 459);
                    var pTemperature = $("<p>").text("Tempeture: " + TempetureToNum + " °F");
                    var pHumidity = $("<p>").text("Humidity: " + response5day.list[i].main.humidity + " %");
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(imgtag);
                    FivedayDiv.append(pTemperature);
                    FivedayDiv.append(pHumidity);
                    $("#boxes").append(FivedayDiv);
                    console.log(response5day);
                    j++;
                }
            }
        })
        .catch(error => console.error(error));
  
});
  

};

//Click function to each Li 
$(document).on("click", "#listC", function() {
var thisCity = $(this).attr("data-city");
getResponseWeather(thisCity);
});
