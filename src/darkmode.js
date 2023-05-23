
// Function to enable dark mode
function enableDarkMode() {
  $("#home").attr("src", "../images/invsona/invsona.png");
  $(".backnav").removeClass("text-bg-light").addClass("text-bg-dark");
  $(".navbar").removeClass("bg-light").addClass("bg-dark");
}

// Function to disable dark mode
function disableDarkMode() {
  $("#home").attr("src", "../images/invsona/home.png");
  $(".backnav").removeClass("text-bg-dark").addClass("text-bg-light");
  $(".navbar").removeClass("bg-dark").addClass("bg-light");
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
