/*
 * Create a list that holds all of your cards
 */
//cardList = $('.deck').children();
//console.log(cardList);
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

var moves = 0;
var open = [];
var matched = [];

$('.restart').on('click',function(){
    moves = 0;
    open = [];
    matched = [];
    $('.moves').text(moves);
    $('.card').removeClass(" open show match");

});

function child_value(element) {
    return $(element).children().attr('class').split(' ')[1];
}


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
        if(child_value(open_element) === value){
            $(open_element).effect( "shake" ).delay(60000).toggleClass( " match");
            $(this).effect( "shake" ).toggleClass( " match");
            matched.push(this);
            matched.push(open_element);
            moves += 1;
        }
        else
        {

            $(open_element).effect( "shake" , {direction:'up'}).toggleClass( " wrong");
            $(this).effect( "shake" , {direction:'up'}).toggleClass( " wrong");
            moves += 1;
            obj = $(this);
            setTimeout($.proxy(function(){
                $(open_element).toggleClass( " open show wrong");
                $(obj).toggleClass( " open show wrong");
            }), 1000);

        }
        $('.moves').text(moves);
    }
}
});
