import {setup} from "../../js/site";

document.addEventListener('DOMContentLoaded', function () {

   setup(); // sets up core site functionality

}); // end DOMContentLoaded handler

// import("https://fonts.google.com/specimen/Bangers?selection.family=Bangers");

// function component() {
//     const element = document.createElement('div');

//     // Add the image to our existing div.
//     const myIcon = new Image();
//     myIcon.width = "20";
//     myIcon.src = icon;

//     element.appendChild(myIcon);

//     return element;
// }

// document.body.appendChild(component());
document.body.innerHTML = "I am about page";


// import("./partials/Home/index.html").then((html) => {
// document.querySelector("main").innerHTML = html.default;
// }).catch((e) => {
//     console.log(e);
// });