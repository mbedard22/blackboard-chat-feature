let classMinimize = false;
let privMinimize = false;
let groupMinimize = false;
let livechat = false;
var socket = io.connect("http://127.0.0.1:8000");
let currentChannel = "general";

$(function(){
    $("#channelPopup").hide();
    //handles the minimizing code 
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
    $("#groupMinimize").click(function() {
        if (groupMinimize == false){
            groupMinimize = true;
            $("#group").children().addClass("hidden");
            $("#groupMinimize").children("i").removeClass("fa-caret-down");
            $("#groupMinimize").children("i").addClass("fa-caret-right");
        }
        else{
            groupMinimize = false;
            $("#group").children().removeClass("hidden");
            $("#groupMinimize").children("i").removeClass("fa-caret-right");
            $("#groupMinimize").children("i").addClass("fa-caret-down");
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

    //changes the content of the page to the blank default
    $("#options").click(function() {
        if (livechat == true){
            livechat = false;
            $("#liveChat").addClass("hidden");
            $("#liveChat").removeClass("flex");
            $("#default").removeClass("hidden");
        }
    });

    //changes the content of the page to the livechat 
    $("#showLivechat").click(function() {
        if (livechat == false){
            livechat = true;
            $("#liveChat").removeClass("hidden");
            $("#liveChat").addClass("flex");
            $("#default").addClass("hidden");
            socket.send(`retrieve,${currentChannel}`)
        }
    });


    //adds new channels depending on which one you click on 
    //shows the hidden pop up
    $("#addChannel").click(function() {
        $("#channelPopup").show();
    });
    //deals with the submittion 
    $("#channelForm").on("submit", function(e) {
        e.preventDefault();
        $("#channelPopup").hide();
        let name = $("#name").val();
        let type = $("#type").val();
        let msgsend = `create,`;
        if(type == "pc"){
            msgsend += `${type},${name},${$("#channelUsers").val()},{{user}}`;
        }
        else if(type == "gc"){
            msgsend += `${type},${name},`;
            for (usr of $("#channelUsers").val()){
                msgsend += `${usr},`;
            }
            msgsend += `{{user}}`;
        }
        else if (type == "cc"){
            msgsend += `${type},${name}`;
        }
        socket.send(msgsend);
    });
    //if it is a priv channel add this field
    $("#type").on("change", function(e){
        $("#additionalInput").remove();
        if ($("#type").val() === "pc"){
            let inpHtml = pcAddInp();
            $("#type").after(inpHtml);
        }
        else if ($("#type").val() === "gc"){
            let inpHtml = gcAddInp();
            $("#type").after(inpHtml);
        }
    });


    //loads all the messages depending on which class chat you click
    {% for c in cc %}
    $("#{{c}}").click(function(){
        socket.send("retrieve,{{c}}");
        currentChannel = "{{c}}";
    });
    {% endfor %}

    //loads all the messages depending on which private chat you click
    {% for privC in pc %}
    $("#{{privC}}").click(function(){
        socket.send("retrieve,{{privC}}");
        currentChannel = "{{privC}}";
    });
    {% endfor %}

    //loads all the messages depending on which group chat you click
    {% for groupC in gc %}
    $("#{{groupC}}").click(function(){
        socket.send("retrieve,{{groupC}}");
        currentChannel = "{{groupC}}";
    });
    {% endfor %}

    //handles outgoing messages to the python server 
    $("#msg").submit(function (e) {
        e.preventDefault();
        let msg = $(this).children().val();
        let dateTime = new Date();
        const messageSent = `msg,{{user}},${dateTime.getMonth()}/${dateTime.getDay()}/${dateTime.getFullYear()} ${timeCorrection(dateTime.getHours(), dateTime.getMinutes())},${msg},${currentChannel}`;
        $(this).children().val("");
        
        socket.send(messageSent);
    });

    //handles incoming messages from the python server
    socket.on("message", function(msg) {
        let msgComp = msg.split(","); 

        //checks to see if we are recieving a message
        if (msgComp[0] == "msg"){
            if (msgComp[4] == currentChannel){
                $("#messages").append(returnMessage(msgComp[3], msgComp[1], msgComp[2]));
            }
        }
        
        //checks to see if we are recieving a messages from a channel
        if (msgComp[0] == "retrieve"){
            $("#messages").html("");
            for (let i = 1; i < msgComp.length; i++){
                let data = msgComp[i].split(";");
                $("#messages").append(returnMessage(data[0], data[2], data[1]));
            }
            
        }
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

function pcAddInp(){
    let html = `
            <div id="additionalInput">
                <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Please select a user</h3>
                <select id="channelUsers" name="channelUsers" class="h-full my-5 rounded-md bg-transparent border-2 border-gray-300 py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
                    {% for usr in users %}
                        {% if usr[0] != user %}<option value="{{usr[0]}}">{{usr[1]}}</option>{% endif %}
                    {% endfor %}
                </select>
            </div>`
    return html
}
function gcAddInp(){
    let html = `
    <div id="additionalInput">
        <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Please hold down ctrl and select users</h3>
        <select id="channelUsers" name="channelUsers" class="h-full my-5 rounded-md bg-transparent border-2 border-gray-300 py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required multiple>
            {% for usr in users %}
                {% if usr[0] != user %}<option value="{{usr[0]}}">{{usr[1]}}</option>{% endif %}
            {% endfor %}
        </select>
    </div>`
    return html
}