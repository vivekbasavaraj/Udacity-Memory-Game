/*
 * Create a list that holds all of your cards
 */

var cardList = $('li.card > i');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*Functions that shuffles the cards and adds to the HTML back */
function shuffle_cards(){
    var i= 0;
    var j= 0;
    var temporary_cardList = cardList.slice();
    shuffle(temporary_cardList);
    var values = [];
    while(i<16){
        values.push($(temporary_cardList[i]).attr('class').split(' ')[1]);
        ++i;
    }

    $(cardList).each(function(){
        oldName = $(this).attr('class').split(' ')[1];
        var name = oldName+' '+values[j];
        $(this).toggleClass(name);
        ++j;
    });
    return;
}

shuffle_cards();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var no_of_stars = 3;
var wrong_moves = 0;
var moves = 0;
var open = [];
var matched = [];
var sec = 0;
var min = 0;
var flag = false;

/*Function to get the value or the name of the card*/
function child_value(element) {
    return $(element).children().attr('class').split(' ')[1];
}

/*Function to restart the whole game, with moves , cards and stars reset*/
function restart_game(){
    no_of_stars = 3;
    wrong_moves = 0;
    moves = 0;
    open = [];
    matched = [];
    $('.moves').text(moves);
    $('.card').removeClass(" open show match");
    reset_star = $( 'ul.stars > li');
    $(reset_star).each(function(){
        reset_star_child = $(this).children();
        if($(reset_star_child).hasClass('fa fa-star-o')){
            $(reset_star_child).toggleClass('fa-star fa-star-o');
        }
    });
    shuffle_cards();
    return;
}

/*Function to print the end result of the page based on won or lost passed as the parameter*/
function display_result(result){
    $('.container').hide();
    if(result === 'won'){
        $('.result-icon').children().removeClass(' fa-times-circle-o').toggleClass(' fa-check-circle-o').css('color', '#66ff66');
        $('.result-header').text('Congratulations..!!');
        $('.result-message').text('You have won this game succesfully with '+no_of_stars+' stars and '+moves+' moves.');
    } else if(result === 'lost'){
        $('.result-icon').children().removeClass(' fa-check-circle-o').toggleClass(' fa-times-circle-o').css('color', '#ff1a1a');
        $('.result-header').text('You Lost..!!');
        $('.result-message').text('You lost this game by losing all stars ');

    }
    $( "button" ).on('click',function(){
        restart_game();
        $('.container').show();
        $('.result').hide();
    });
    $('.result').show();
    return;
}

/*Function to open the card and display*/
function open_card(card){
    $(open_element).effect( "shake" ).toggleClass( " match");
    $(card).effect( "shake" ).toggleClass( " match");
    matched.push(card);
    matched.push(open_element);
    moves += 1;
    return;
}

/*Function to close the card and hide its display*/
function close_card(card){
    $(open_element).effect( "shake" , {direction:'up'}).toggleClass( " wrong");
    $(card).effect( "shake" , {direction:'up'}).toggleClass( " wrong");
    moves += 1;
    wrong_moves += 1;
    obj = $(card);
    setTimeout($.proxy(function(){
        $(open_element).toggleClass( " open show wrong");
        $(obj).toggleClass( " open show wrong");
    }), 1000);
    reduce_stars();
    return;
}

/*Function to reduce the number of stars based on the number of wrong moves*/
function reduce_stars(){
    switch(wrong_moves){
        case 4:
        case 12:
        case 20:no_of_stars -= 1;
                star_obj = $(stars[no_of_stars]).children();
                $(star_obj).toggleClass(" fa-star fa-star-o");
                if(no_of_stars === 0){
                    display_result('lost');
                }
                 break;
    }
    return;
}

/*Function to run the timer with secs and minutes*/
function stopclock(){
    sec = 0;
    min = 0;
    setInterval(function(){
        ++sec;
        if(sec>60){
            sec = 0;
            ++min;
        }
        time = min + ':' + sec;
        $('.time').text(time);
    },1000);
    return;
}

stars = $('.stars').children();
$('.deck').hide();
$('.result').hide();

/*Starts the game for the user*/
$('.start').on('click',function(){
    $('.start').hide();
    $('.deck').show();
    stopclock();
    flag = true;
});

/*Restarts the game if either restart is pressed or if the user wants to play one more game*/
$('.restart').on('click', function(){
    restart_game();
    if(flag){
           stopclock();
    }
});

/*if a card is pressed, it reacts based on the state of the card*/
$('.card').on('click',function(){
    if(!matched.includes(this)){
        $(this).toggleClass( "open show");
        value = child_value(this);
        if(open.length === 0){
            open.push(this);
        }
        else
        {
            open_element = open.pop();
            current_card = $(this);
            ((child_value(open_element) === value)?(open_card(current_card)):(close_card(current_card)));
            $('.moves').text(moves);
            if(matched.length === 16){
                display_result('won');
            }
        }
    }
});
