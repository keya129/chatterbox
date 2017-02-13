/*
*
*@author Keya Bhatt
*@since  Feb 2017
*/
$ = jQuery.noConflict();

//Generate unique id for each user
var newUUID = PubNub.generateUUID();

//create a pubnub object, taking keys from admin dashboard
var pubnub = new PubNub({
    uuid: newUUID,
    publishKey: 'pub-c-760a9445-9ff2-40c1-af80-73e659ce4ee3',
    subscribeKey: 'sub-c-fba923bc-f024-11e6-b753-0619f8945a4f',
    ssl: true
});

//subscribe to channel room-1
pubnub.subscribe({
    channels: ['room-1'],
    withPresence: true
});

//Keep the username information in state
pubnub.setState({
        state: {
            user: pubnub.username
        },
        channels: ['room-1']
    },
    function(status) {
        // handle state setting response
    }
);

function getState() {
    pubnub.getState({
            channels: ['room-1']
        },
        function(status) {
            // handle state setting response
        }
    );
}
// unsubscribe when user clicks on Leave room
function LeaveRoom() {
    pubnub.unsubscribe({
        channels: ['room-1']
    })
    location.reload();
}

//Send a message in the room when send button is clicked
function sendMessage(msg) {
    pubnub.publish({
            message: {
                avatar: 'user.png',
                user: pubnub.username,
                time: new Date().toUTCString(),
                text: msg
            },
            channel: 'room-1'
        },
        function(status, response) {
            // handle status, response
        });


}

//Keep listening for any new messages in room
pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            //sendMessage();

        }
    },
    message: function(message) {
        console.log("New Message!!", message);
        var flag = 0;
        $('#onlinearea ul li').each(function(e) {
            if ($(this).html() == message.message.user) {
                flag = 1;
            }
        });
        if (flag == 0) {
            $('#onlinearea ul').append('<li>' + message.message.user + '</li>');
        }
        $('#chattextarea').append('<div class="newmsg"><div class="leftmsg"><img src="images/user.png" alt="" width:"30" height="30" /><p>' + message.message.user + '</p></div><div class="rightmsg"><p>' + message.message.text + '</p></div><p>' + message.message.time + '</p></div>');

    },
    presence: function(presenceEvent) {
        // handle presence
    }
})
/**Custom Functions***/
$(document).ready(function(e) {

    $('#sendbutton').click(function(e) {
        e.preventDefault();
        var text = $('#message').val();
        $('#message').val('');
        sendMessage(text);
        getState();

        console.log(pubnub.username);
    });
    $('#leaveroom').click(function(e) {
        e.preventDefault();
        LeaveRoom();

    });
    $('#username').bind("enterKey", function(e) {
        //do stuff here
        pubnub.username = $('#username').val();
        $('#popup').hide();
        $('#chattextarea').append('<div class="row"><p id="intro">Welcome ' + pubnub.username + ' to Chatter Box. You can start sending and receiving messages </p></div>');

    });
    $('#username').keyup(function(e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
    $('#message').keyup(function(e) {
        if (e.keyCode == 13) {
            $('#sendbutton').trigger("click");
        }
    });



});