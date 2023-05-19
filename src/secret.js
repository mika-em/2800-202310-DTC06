// This is a secret backend for the easter egg
function secret() {
    console.log('You found the secret!');
    //add the secret class 
    $('#login').addClass('secret');
    $('#login').removeAttr('id');
    $('#meow').append('<audio autoplay loop><source src="../images/cats/meow.mp3" type="audio/mpeg" loop="true"></audio>');
    $('.bg').append('<video autoplay muted loop id="meow"><source src="./images/cats/meow.mp4" type="video/mp4" /></video>');
    $('body').addClass('flash');
}

