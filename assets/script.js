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


