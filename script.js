const rumbleCheckbox =
document.getElementById("rumble");

const tcpImage =
document.getElementById("tcpImage");

rumbleCheckbox.addEventListener(
"change",
function(){

    if(this.checked){
        tcpImage.src =
        "images/1-2b/1-2b-rumble.png";
    }
    else{
        tcpImage.src =
        "images/1-2b/1-2b-no-rumble.png";
    }

});
