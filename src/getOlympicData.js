const Loader = new function () {
  this.getOlympicYears = async () => $.get('/a/data/years');
};

const summerDataLoader = new function () {
  this.getSummerYearList = async () => $.get('/a/olympic/summer');
};

const winterDataLoader = new function () {
  this.getWinterYearList = async () => $.get('/a/olympic/winter');
};

const sportsListLoader = new function (season, year) {
  this.getSportsList = async (season, year) => $.get('/a/olympic/' + season + '/sportsList/' + year);
};

const countryMedalRankLoader = new function (season, year, checkedSports) {
  this.getCountryMedalRank = async (season, year, checkedSports) => $.get('/a/olympic/' + season + '/countryMedalRank/' + year + '&' + checkedSports);
};

const countryMedalValueLoader = new function (season, year, checkedSports) {
  this.getCountryMedalValue = async (season, year, checkedSports) => $.get('/a/olympic/' + season + '/countryMedalValue/' + year + '&' + checkedSports);
};