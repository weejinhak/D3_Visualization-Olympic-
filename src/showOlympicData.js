const contents = new function() {
    const that = this;
    this.countryMedalValue = null;

    let season = null;
    let year = null;
    let yearList = null;
    let checkedSports = null;
    let countryMedalRank = null;

    let $slider = $('#slider');
    let $sliderVal = $('#slider-value');
    let $sportsList = $('#sports-list');
    let $countryMedalRank = $('#country-medal-rank');

    async function initView(){
        const summerYearList = await summerDataLoader.getSummerYearList();
        const winterYearList = await winterDataLoader.getWinterYearList();
    
        const $summerBtn = $('#summer-button');
        const $winterBtn = $('#winter-button');

        const init_yearList = summerYearList;
        yearList = init_yearList;
        const init_year = yearList[0];
        const init_season = "summer";
        year = init_year;
        season = init_season;
    
        initSlider();
        showSportsList();
        
    
        $summerBtn.on('click', async() => {
            season = "summer";
            yearList = summerYearList;
            year = yearList[0];
            
            initSlider();
            showSportsList();
        });
        
        $winterBtn.on('click', async() => {   
            season = "winter";
            yearList = winterYearList;
            year = yearList[0];
    
            initSlider();
            showSportsList();
        });
    
        
        $slider.on("slide", async (event, ui) => {
            year = yearList[ui.value];
            showSportsList();

        });
    }

    async function showSportsList() {
        const sportsList = await sportsListLoader.getSportsList(season, year);
        $sportsList.empty();
        _.map(sportsList, s => {
            $(`<label class="check-container">${s}<input type="checkbox" name="sports" value="${s}" checked></input><span class="check-mark"></span></label><br>`).on("change", async() => {
                getSportsList();
            }).appendTo($sportsList);
        });
        getSportsList();
    }

    function getSportsList() {
        checkedSports = [];
        $countryMedalRank.empty();
        $('input:checkbox[name="sports"]:checked').each(function(){
            checkedSports.push($(this).val());
        });
        showRankTable();
    }

    function initSlider() {
        $slider.slider({
            range: "min",
            value: 0,
            min: 0,
            max: yearList.length - 1,
            step: 1,
            slide: function(event, ui) {
                $sliderVal.text(yearList[ui.value]);
                year = yearList[ui.value];
            }
        });
        $sliderVal.text(yearList[0]);
    }

    async function showRankTable() {
        countryMedalRank = await countryMedalRankLoader.getCountryMedalRank(season, year, checkedSports);
        that.countryMedalValue = await countryMedalValueLoader.getCountryMedalValue(season, year, checkedSports);
   
        const index = countryMedalRank.length;
        $('#ranking-table').empty();
        $(`<tr><th id="table-rank" >Rank</th></tr>
               <tr><th id="table-country" >Country</th></tr>
               <tr><th id="table-gold" ><img src="./images/gold-medal.png", height=30px, width=30px></th></tr>
               <tr><th id="table-silver" ><img src="./images/silver-medal.png", height=30px, width=30px></th></tr>
               <tr><th id="table-bronze" ><img src="./images/bronze-medal.png", height=30px, width=30px></th></tr>
               <tr><th id="table-sum" >Sum</th></tr>`).appendTo($('#ranking-table'));
        _.map(countryMedalRank, (cm, i) => {
            if(index - i <= 15) {
                $('#table-rank').after(`<td>${index-i}</td>`);
                $('#table-country').after(`<td>${cm['country']}</td>`);
                $('#table-gold').after(`<td>${cm['GOLD']}</td>`);
                $('#table-silver').after(`<td>${cm['SILVER']}</td>`);
                $('#table-bronze').after(`<td>${cm['BRONZE']}</td>`);
                $('#table-sum').after(`<td>${cm['GOLD'] + cm['SILVER'] + cm['BRONZE']}</td>`);
            }
        });

        showWorldMap();
    }

    initView();
}