const display = document.getElementById("display");
// ...existing code...
const displayText = document.getElementById("displayText"); // span only

function clearDisplay() {
    displayText.textContent = ""; // clear text

    // animate ONLY the text span
    displayText.classList.add("animate__animated", "animate__fadeOutLeft");

    displayText.addEventListener("animationend", () => {
        displayText.classList.remove("animate__animated", "animate__fadeOutLeft");
    }, { once: true });
}
// ...existing code...
//3 functions to create 
function appendToDisplay(input){
    display.value += input;
}
function clearDisplay(){
    display.value = "";
    //add the animate.css class effect
    display.classList.add("animate__animated",'animate__fadeOutLeft');
    display.addEventListener("animationend",() => {
        display.classList.remove("animate__animated",'animate__fadeOutLeft');
    }, {once:true }); 
}
function calculate(){
    try{
        display.value = eval(display.value);
    }
    catch(error){
        display.value = "Error";
    }
    
}
