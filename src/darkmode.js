//when dark mode is turn on:
// 1. nav bar will change: symbol and text
// 2. background will change: internal, persona, dialogue


function darkMode() {
    console.log("dark mode is on");
    


}  

$("#dark").on("change", function() {
    if ($(this).is(":checked")) {
      darkMode();
    }
  });