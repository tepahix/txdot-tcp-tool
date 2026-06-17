const rumbleCheckbox =
document.getElementById("rumble");

const tcpImage =
document.getElementById("tcpImage");

rumbleCheckbox.addEventListener(
"change",
function(){

    if(this.checked){
        tcpImage.src =
        "images/tcp01-rumble.png";
    }
    else{
        tcpImage.src =
        "images/tcp01-base.png";
    }

});
