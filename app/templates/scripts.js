let classMinimize = false;
let privMinimize = false;
let livechat = false;
var socket = io.connect("http://127.0.0.1:8000");

$(function(){
    $("#classMinimize").click(function() {
        if (classMinimize == false){
            classMinimize = true;
            $("#class").children().addClass("hidden");
            $("#classMinimize").children("i").removeClass("fa-caret-down");
            $("#classMinimize").children("i").addClass("fa-caret-right");
        }
        else{
            classMinimize = false;
            $("#class").children().removeClass("hidden");
            $("#classMinimize").children("i").removeClass("fa-caret-right");
            $("#classMinimize").children("i").addClass("fa-caret-down");
        }
    });
    $("#privMinimize").click(function() {
        if (privMinimize == false){
            privMinimize = true;
            $("#private").children().addClass("hidden");
            $("#privMinimize").children("i").removeClass("fa-caret-down");
            $("#privMinimize").children("i").addClass("fa-caret-right");
        }
        else{
            privMinimize = false;
            $("#private").children().removeClass("hidden");
            $("#privMinimize").children("i").removeClass("fa-caret-right");
            $("#privMinimize").children("i").addClass("fa-caret-down");
        }
    });

    $("#options").click(function() {
        if (livechat == true){
            livechat = false;
            $("#liveChat").addClass("hidden");
            $("#liveChat").removeClass("flex");
            $("#default").removeClass("hidden");
        }
    });
    $("#showLivechat").click(function() {
        if (livechat == false){
            livechat = true;
            $("#liveChat").removeClass("hidden");
            $("#liveChat").addClass("flex");
            $("#default").addClass("hidden");
        }
    });

    //handles outgoing messages to the python server 
    $("#msg").submit(function (e) {
        e.preventDefault();
        let msg = $(this).children().val();
        let dateTime = new Date();
        const messageSent = `{{user}}, ${dateTime.getMonth()}/${dateTime.getDay()}/${dateTime.getFullYear()} ${timeCorrection(dateTime.getHours(), dateTime.getMinutes())}, ${msg}`;
        $(this).children().val("");
        
        socket.send(messageSent)
    });

    //handles incoming messages from the python server
    socket.on("message", function(msg) {
        let msgComp = msg.split(","); 
        $("#messages").append(returnMessage(msgComp[2], msgComp[0], msgComp[1]))
    });


});

function returnMessage(body, sender, timestamp){
    let li = `  <div class="flex items-center">
                    <p class="text-lg font-bold text-black">${sender}</p>
                    <p class="ml-3 text-sm text-gray-400">${timestamp}</p>
                </div>
                <p class="ml-5 mb-5 text-gray-700">${body}</p>`
    return li;
}

function timeCorrection(hours, minutes){
    let newMinutes = "";
    if (minutes < 10){
        newMinutes = `0${minutes}`;
    }
    newMinutes = minutes.toString();
    if (hours > 12){
        return `${hours-12}:${newMinutes} pm`;
    }
    
    return `${hours}:${newMinutes} am`;
}