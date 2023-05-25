
// Function to enable dark mode
function enableDarkMode() {
  $("#home").attr("src", "../images/invsona/invsona.png");
  $(".backnav").removeClass("text-bg-light").addClass("text-bg-dark");
  $(".navbar").removeClass("bg-light").addClass("bg-dark");
  $(".card").removeClass("bg-light").addClass("bg-dark");
  $(".card").removeClass("text-dark").addClass("text-light");
  $(".card").removeClass("border-light").addClass("border-dark");
  $(".invsona-bg").addClass("invsona-bg-dark");
  $(".invsona-bg").removeClass("invsona-bg");
  $(".persona-bg").addClass("persona-bg-dark");
  $(".persona-bg").removeClass("persona-bg");
  $(".dialogue-bg").addClass("dialogue-bg-dark");
  $(".dialogue-bg").removeClass("dialogue-bg");
  $("#display-name").addClass("text-light");
  $(".main").addClass("btn-outline-dark");
  $(".main").removeClass("btn-outline-light");
}

// Function to disable dark mode
function disableDarkMode() {
  $("#home").attr("src", "../images/invsona/home.png");
  $(".backnav").removeClass("text-bg-dark").addClass("text-bg-light");
  $(".navbar").removeClass("bg-dark").addClass("bg-light");
  $(".card").removeClass("bg-dark").addClass("bg-light");
  $(".card").removeClass("text-light").addClass("text-dark");
  $(".card").removeClass("border-dark").addClass("border-light");
  $(".invsona-bg-dark").addClass("invsona-bg");
  $(".invsona-bg-dark").removeClass("invsona-bg-dark");
  $(".persona-bg-dark").addClass("persona-bg");
  $(".persona-bg-dark").removeClass("persona-bg-dark");
  $(".dialogue-bg-dark").addClass("dialogue-bg");
  $(".dialogue-bg-dark").removeClass("dialogue-bg-dark");
  $("#display-name").removeClass("text-light");
  $(".main").addClass("btn-outline-light");
  $(".main").removeClass("btn-outline-dark");

}

// Check if dark mode is enabled in local storage
const isDarkModeEnabled = localStorage.getItem("darkMode") === "on";

// Set the initial state of the dark mode switch based on local storage
$("#dark").prop("checked", isDarkModeEnabled);

// Apply dark mode or light mode based on the initial state
if (isDarkModeEnabled) {
  $("#dark").addClass("active");
  enableDarkMode();
} else {
  disableDarkMode();
}

// Event handler for dark mode switch
$("#dark").on("change", function() {
  if ($(this).is(":checked")) {
    $(this).addClass("active");
    enableDarkMode();
    localStorage.setItem("darkMode", "on");
  } else {
    $(this).removeClass("active");
    disableDarkMode();
    localStorage.setItem("darkMode", "off");
  }
});
