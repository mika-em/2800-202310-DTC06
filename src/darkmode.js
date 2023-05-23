//when dark mode is turn on:
// 1. nav bar will change: symbol and text
// 2. background will change: internal, persona, dialogue


function darkMode() {
    console.log("dark mode is on");
    $(".navbar").removeClass("bg-light").addClass("bg-dark");
    $("#home").removeAttribute("src");
    $("#home").setAttribute("src", "../images/invsona/home-light.png");
    
  
}  

function lightMode(){
    console.log("dark mode is off");
    $(".navbar").removeClass("bg-dark").addClass("bg-light");
    $("#home").removeAttribute("src")
    $("#home").setAttribute("src", "../images/invsona/home.png");
}

$("#dark").on("change", function() {
    if ($(this).is(":checked")) {
      $("#dark").attr("checked", true);
      darkMode();
    }
    else {
      $("#dark").attr("checked", false);
      lightMode();
    }
  });