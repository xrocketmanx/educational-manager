var recordingVideo = document.querySelector('#recording-video'),
    framesContainer = document.querySelector('#frames-container');

var videoBroadcast = new VideoBroadcast({
    url: location.origin.replace(/^http/, 'ws'),
    videoElement: recordingVideo,
    imageElement: framesContainer,
    height: 360,
    fps: 24,
    room: courseId
});

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