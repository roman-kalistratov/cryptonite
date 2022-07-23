$(window).ready(function () {
    
    var page = 1;
    var savedCoins = JSON.parse(localStorage.getItem("coins")) || [];
    var savedReports = JSON.parse(localStorage.getItem("reports")) || [];

    

    pagination();
    getAllCoins(page);
    
     /*=============== HIDE MODAL HOME ===============*/
    $('button[data-dismiss="modal"]').on('click',function() {
        $('#modalHome').css('display','none');
        location. reload();
    })


    // modal report card
    function reportsCard() {
        $('.cards-report').empty();
        let coinId;
        savedReports.forEach((item,index) =>{
            // console.log(item,index);
            $('.cards-report').append(`
            <div class="col-lg-6 col-md-4">
                <div class="card shining-card">
                    <div class="card-body">
                    <img src="${item[3]}"
                        class="img-fluid avatar avatar-rounded report-img" alt="img60">
                        <span class="fs-4">${item[2]}</span>                                
                                                        
                        <div class="progress-detail">
                            <span class="fs-5 me-3">${item[1]}</span>
                        </div>   
                                            
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" checked data-index="${index}" data-coinId="${item[0]}" />
                        </div>                        
                    </div>
                </div>
            </div>
            `);

            // removing card from modal window and from array savedReports
            $('.cards-report').on('change', `input[data-coinId="${item[0]}"]`, function () {
                const coinId = $(this).attr('data-coinId');
            
              for(let i=0;i<savedReports.length;i++) {
                if(savedReports[i][0] == coinId){                    
                    savedReports.splice(i, 1);                  
                    $(this).parent().parent().parent().hide();
                    localStorage.setItem("reports", JSON.stringify(savedReports));                    
                }                
              }
            })           
        })
    }


    /*=============== COUNT AND SAVE 5 CHECKED CARDS ===============*/
    $('body').on('change', '.form-check-input', function () {
        const coinId = $(this).attr('data-coinId');
        const coinInfo = $(this).attr('data-coinInfo').split(',');
        const length = savedReports.length + 1;

        // display and interaction with saved reports
        reportsCard();       

        if(length > 5) {
            if(!$(this).is(':checked')) {                
            }
            else {               
                $('#modalHome').css('display','block');                
                $(this).prop('checked', false);
                length--;             
            }           
        }

        if ($(this).is(':checked')) {
            savedReports.push(coinInfo);
          
        } else {
            let index = savedReports.indexOf(coinId);
            savedReports.splice(index, 1);
            $(this).prop('checked', false);
            
        }
        
        localStorage.setItem("reports", JSON.stringify(savedReports));
    });


    /*=============== SEARCH COINS BY Coin ID ===============*/
    $("#input-search").on("keyup", function () {
        var search = $(this).val();
        // console.log(search);
        $('#cards-filed').html('');
        if (search != '') {
            savedCoins.forEach(coin => {
                if (coin.symbol.includes(search)) {
                    getCoinById(coin.id);
                }
            })
        } else {
            getAllCoins(page);
        }
    })

    /*=============== SHOW ALL COINS After clear seach input ===============*/
    $('.search-input input').on('search', function () {
        savedCoins.forEach(item => {
            showCoins(item);
        });
    })

    /*=============== GET COINS FROM API BY ID===============*/
    function getCoinById(coinId) {
        $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
            beforeSend: function () {
                $('.load').show();
            },
            complete: function () {
                $('.load').hide();
            },
            success: function (data) {
                showCoins(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }


    /*=============== GET DATA FROM API BY TITLE===============*/
    function getAllCoins(page) { 
        $.ajax({
            // вся имеющиася криптовалюта
            url: 'https://api.coingecko.com/api/v3/coins?page=' + `${page}`,
            beforeSend: function () {
                $('.load').show();
            },
            complete: function () {
                $('.load').hide();
            },
            success: function (data) {
                localStorage.setItem("coins", JSON.stringify(data));
                // console.log(data);
                data.forEach(item => {
                    showCoins(item);
                });

            },
            error: function (err) {
                console.log(err);
            }
        });
    }


    /*=============== SHOW DATA ===============*/
    function showCoins(result) {
        let coinInfo = [result.id,result.name,result.symbol,result.image.large];

        /*=============== card ===============*/
        card = `
            <div class="col-lg-3 col-md-4">
                <div class="card shining-card">
                    <div class="card-body">
                        <img src="${result.image.large}"
                            class="img-fluid avatar avatar-rounded" alt="img60">
                        <span class="fs-5 me-2">${result.symbol}</span>                                
                        <span class="fs-2 me-2 coin-price">&#36;${(result.market_data.current_price.usd).toFixed()}</span>
                                                        
                        <div class="progress-detail pt-3">
                            <span class="fs-5 me-2">${result.name}</span>
                        </div>   
                                            
                        <div class="form-check form-switch form-check-inline">
                            <input class="form-check-input" type="checkbox" data-coinInfo="${coinInfo}" data-coinId="${result.symbol}" />
                        </div>
                        <div class="chart" data-coinId="${result.id}"></div>
                        <a class="btn btn-primary" data-bs-toggle="collapse" href="#${result.id}" role="button" aria-expanded="false"
                         aria-controls="${result.id}" style='margin-top:10px'>
                          More info
                        </a>
                        <div class="collapse" id="${result.id}">
                            <div class="card card-body more-info">
                                <div class='block'>
                                    <p>
                                        24h  ${Math.floor(result.market_data.price_change_percentage_24h).toFixed(1)}% | 
                                        7d  ${Math.floor(result.market_data.price_change_percentage_7d).toFixed(1)}% | 
                                        14d  ${Math.floor(result.market_data.price_change_percentage_14d).toFixed(1)}% 
                                    </p>
                                </div>
                                <ul style='font-size:20px'>
                                    <li data-id = "${result.id}">&#36; ${result.market_data.current_price.usd} <small>${result.market_data.market_cap_change_percentage_24h_in_currency.usd}%</small></li>
                                    <li data-id = "${result.id}">&#8364; ${result.market_data.current_price.eur} <small>${result.market_data.market_cap_change_percentage_24h_in_currency.eur}%</small></li>
                                    <li data-id = "${result.id}">&#8362; ${result.market_data.current_price.ils} <small>${result.market_data.market_cap_change_percentage_24h_in_currency.ils}%</small></li>                                      
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

        $('#cards-filed').append(card);
          

        // change the position of the checkbox of the selected coins when loading the page
        savedReports.forEach(report => {
           
            if (result.symbol == report[2])
                $(`input[data-coinId="${result.symbol}"`).prop('checked', true);
        })





        if (result.market_data.market_cap_change_percentage_24h_in_currency.usd < 0) {
            $(`.more-info li[data-id="${result.id}"]:first-child small`).css('color', 'rgb(216, 58, 58)');
        }
        if (result.market_data.market_cap_change_percentage_24h_in_currency.eur < 0) {
            $(`.more-info li[data-id="${result.id}"]:nth-child(2) small`).css('color', 'rgb(216, 58, 58)');
        }
        if (result.market_data.market_cap_change_percentage_24h_in_currency.ils < 0) {
            $(`.more-info li[data-id="${result.id}"]:last-child small`).css('color', 'rgb(216, 58, 58)');
        }



        /*=============== pagination display ===============*/
        row = `
            <li class="page-item disabled" id="prev">
            <a class="page-link" href="#" tabindex="-1"
                aria-disabled="true">Previous</a>
            </li>
            <li class="page-item dvr1"><a class="page-link" href="#">First</a></li>

            <li class="page-item"><a class="page-link" href="#">${page - 1}</a></li>
            <li class="page-item active" aria-current="page">
                <a class="page-link" href="#">${page}</a>
            </li>
            <li class="page-item"><a class="page-link" href="#">${page + 1}</a></li> 
            <li class="page-item" id="next">
                <a class="page-link" href="#">Next</a>
            </li>
            `

        /*=============== pagination config ===============*/
        $('.pagination').html(row);
        if (page == 1) {
            $('.pagination li:first-child').prop('disabled', true);
            $('.pagination li:nth-child(2)').hide();
            $('.pagination li:nth-child(3)').hide();
        } else if (page > 1) {
            $('.dvr1').show();
            $('.pagination li:first-child').removeClass('disabled');

        } else {
            $('.dvr1').hide();
            $('.pagination li:first-child').addClass('disabled');
            $('.pagination li:nth-child(2)').show();
            $('.pagination li:nth-child(3)').hide();

        }


        /*=============== apend data to news  auto scrolling ===============*/
        $('#scroll_news').append(`
            <span data-id = "${result.id}">${result.name} </span>                  
            <span data-id = "${result.id}">$${Math.round(result.market_data.current_price.usd).toFixed(2)}</span>  
            <span data-id = "${result.id}" style="margin-right:20px">${result.market_data.market_cap_change_percentage_24h_in_currency.usd}% </span>        
            `)

        if (result.market_data.market_cap_change_percentage_24h_in_currency.usd < 0) {
            $(`#scroll_news span[data-id="${result.id}"]`).css('color', 'red');
        } else {
            $(`#scroll_news span[data-id="${result.id}"]`).css('color', 'rgb(207, 180, 24)');
        }
    }

    /*=============== PAGINATION ===============*/
    function pagination() {
        $('.pagination').on('click', '#next', function () {
            $('#cards-filed').empty();
            page++;
            getAllCoins(page);
        })
        $('.pagination').on('click', '#prev', function () {
            $('#cards-filed').empty();
            page--;
            getAllCoins(page);
        })
        $('.pagination').on('click', 'li:nth-child(2)', function () {
            $('#cards-filed').empty();
            page = 1;
            getAllCoins(page);
        })
        $('.pagination').on('click', 'li', function () {
            $('#cards-filed').empty();
            if ($(this).next().hasClass('active')) {
                page--;
            } else if ($(this).prev().hasClass('active')) {
                page++;
            }

            getAllCoins(page);
        })
    }

    /*=============== auto scrolling text news stop/start ===============*/
    $('#icon-play').on('click', function () {
        $('#icon-play svg path').toggleClass('svg-red');

        if ($('#icon-play svg path').hasClass('svg-red')) {
            document.getElementById('scroll_news').stop();
        } else {
            document.getElementById('scroll_news').start();
        }
    })











});