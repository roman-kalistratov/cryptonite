$(window).ready(function () {
    let intervalId;

    $('#nav-report-tab').on('click', () => {
        var savedReports = JSON.parse(localStorage.getItem("reports")) || [];

        // checks if 5 coins have been received
        if (savedReports.length < 5) {
            $('#card-reports').empty();
            $('#modalReport').css('display','block');
        } else {
           
            savedReports.forEach(item => {
                console.log(item);
                $('#chart-data').append(`
                    <div style="margin-right:15px;">
                        <img  src="${item[3]}" alt="load" style="width:30px;">
                        <label class="form-check-label" style="color:#FA971E;" for="flexRadioDefault1">${item[2]}
                        </label>
                    </div>
                `);
            });
           
            let selectedCoin1 = [];
            let selectedCoin2 = [];
            let selectedCoin3 = [];
            let selectedCoin4 = [];
            let selectedCoin5 = [];
            let coinKeysArray = [];
            $(".load").show();
            intervalId = setInterval(() => {
                getData();
            }, 2000);
            /*=============== GET COINS FROM API ===============*/
            function getData() {
                $.ajax({
                    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${savedReports[0][2]},${savedReports[1][2]},${savedReports[2][2]},${savedReports[3][2]},${savedReports[4][2]}&tsyms=USD`,
                    
                    complete: function () {
                        $('.load').hide();
                    },
                    success: function (data) {
                        let dateNow = new Date();
                        let coinToShowOnGraph = 1;
                        coinKeysArray = [];

                        for (let key in data) {

                            if (coinToShowOnGraph == 1) {
                                selectedCoin1.push({
                                    x: dateNow,
                                    y: data[key].USD
                                });
                                coinKeysArray.push(key);
                            }

                            if (coinToShowOnGraph == 2) {
                                selectedCoin2.push({
                                    x: dateNow,
                                    y: data[key].USD
                                });
                                coinKeysArray.push(key);
                            }

                            if (coinToShowOnGraph == 3) {
                                selectedCoin3.push({
                                    x: dateNow,
                                    y: data[key].USD
                                });
                                coinKeysArray.push(key);
                            }

                            if (coinToShowOnGraph == 4) {
                                selectedCoin4.push({
                                    x: dateNow,
                                    y: data[key].USD
                                });
                                coinKeysArray.push(key);
                            }

                            if (coinToShowOnGraph == 5) {
                                selectedCoin5.push({
                                    x: dateNow,
                                    y: data[key].USD
                                });
                                coinKeysArray.push(key);
                            }

                            coinToShowOnGraph++;

                        }

                        createGraph();
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
                
                function createGraph() {
                    let chart = new CanvasJS.Chart("chartContainer", {
                        exportEnabled: true,
                        animationEnabled: false,
                        toolbar: false,
                        zoomEnabled: false,
                        theme: 'dark1',                       
                        axisX: {                           
                            valueFormatString: "HH:mm:ss",                           
                        },
                        axisY: {                           
                            prefix: "$",
                            titleFontColor: "#4F81BC",
                            lineColor: "#4F81BC",
                            labelFontColor: "#4F81BC",
                            tickColor: "#4F81BC",
                            includeZero: true,                           
                        },

                        toolTip: {
                            shared: true
                        },
                        legend: {
                            verticalAlign: "top",
                            fontSize: 18,
                            fontColor: "dimGrey",                          
                        },
                        data: [{
                                type: "spline",
                                name: coinKeysArray[0],
                                showInLegend: true,
                                xValueFormatString: "HH:mm:ss",
                                dataPoints: selectedCoin1,
                            },
                            {
                                type: "spline",
                                name: coinKeysArray[1],
                                showInLegend: true,
                                xValueFormatString: "HH:mm:ss",
                                dataPoints: selectedCoin2,
                            },
                            {
                                type: "spline",
                                name: coinKeysArray[2],
                                showInLegend: true,
                                xValueFormatString: "HH:mm:ss",
                                dataPoints: selectedCoin3,
                            },
                            {
                                type: "spline",
                                name: coinKeysArray[3],
                                showInLegend: true,
                                xValueFormatString: "HH:mm:ss",
                                dataPoints: selectedCoin4,
                            },
                            {
                                type: "spline",
                                name: coinKeysArray[4],
                                showInLegend: true,
                                xValueFormatString: "HH:mm:ss",
                                dataPoints: selectedCoin5,
                            }
                        ]
                    });

                    chart.render();                    
                }
            }
        }

    })

    // resets the Interval when switching to other tabs
    $('#nav-home-tab').on('click', () => {
        clearInterval(intervalId);
    })
    $('#nav-about-tab').on('click', () => {
        clearInterval(intervalId);
    })












});