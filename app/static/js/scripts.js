let classMinimize = false;
let privMinimize = false;
let livechat = false;
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

    $("form").submit(function (e) {
        e.preventDefault();
        const messageSent = $(this).children().val();
        $(this).children().val("");

        $("#messages").children(":last-child").after(returnMessage(messageSent, "Gabriel Vega", "11:30 pm"))
        console.log(`sent message: ${messageSent}`);

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