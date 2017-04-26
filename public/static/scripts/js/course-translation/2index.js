var recordingVideo = document.querySelector('#recording-video'),
    framesContainer = document.querySelector('#frames-container');

var SOCKET_URL = location.origin.replace(/^http/, 'ws');

var videoBroadcast = new VideoBroadcast({
    url: SOCKET_URL,
    videoElement: recordingVideo,
    imageElement: framesContainer,
    height: 360,
    fps: 24,
    room: courseId
});

document.getElementById('rotate').onclick = function() {
    document.getElementById('frames-container').classList.toggle('phone-fix');
};

document.getElementById('broadcast').onclick = function() {
    videoBroadcast.start(function() {
        recordingVideo.style.display = '';
    });
};
document.getElementById('stop').onclick = function() {
    videoBroadcast.stop();
    recordingVideo.style.display = 'none';
};
document.getElementById('capture').onclick = function() {
    videoBroadcast.subscribe(function() {
        framesContainer.hidden = false;
    }, function() {
        framesContainer.hidden = true;
    });
};
document.getElementById('stopPlayback').onclick = function() {
    videoBroadcast.stopPlayback();
    framesContainer.hidden = true;
};

var socket = videoBroadcast.getSocket();
var chatForm = document.forms.chat;

chatForm.elements.message.onkeydown = function (event) {
    if (event.keyCode === 13) {
        sendMessage();
        return false;
    }
};

socket.open(SOCKET_URL, function () {
    chatForm.onsubmit = function () {
        sendMessage();
        return false;
    };

    socket.on(courseId + '/message', receiveMessage);
});

function sendMessage() {
    var messageEl = chatForm.elements.message;
    if (messageEl.value.length) {
        socket.send(courseId + '/message', messageEl.value);
        receiveMessage(messageEl.value);

        messageEl.value = '';
    }
}

function receiveMessage(message) {
    chatForm.elements.messages.value += message + '\n';
}