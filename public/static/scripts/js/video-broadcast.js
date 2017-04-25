//TODO: callbacks fires twice after stop after continue (problem in socket-events)
var VideoBroadcast = (function(window, undefined) {
    "use strict";

    VideoBroadcast.STATES = {
        BROADCASTING: 'BROADCASTING',
        CAPTURING: 'CAPTURING',
        WAITiNG: 'WAITING'
    };

    function VideoBroadcast(options) {
        this.state = VideoBroadcast.STATES.WAITiNG;

        this._room = options.room || '';
        this._delay = options.delay = options.delay || 3000;
        this._url = options.url;

        this._audioBroadcast = new AudioBroadcast(options);
        this._framesBroadcast = new FramesBroadcast(options);
        this._socketEvents = new SocketEvents();
    }

    VideoBroadcast.prototype.start = function(callback) {
        if (this.state !== VideoBroadcast.STATES.WAITiNG) return;

        var self = this;
        this._socketEvents.open(this._url, function() {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(function(audioStream) {
                self._audioStream = audioStream;

                return navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
            }).then(function(videoStream) {
                self._videoStream = videoStream;

                self._handleAudioStream(self._audioStream);
                self._handleVideoStream(self._videoStream);

                self.state = VideoBroadcast.STATES.BROADCASTING;
            }).then(callback);
        });
    };

    VideoBroadcast.prototype.stopPlayback = function() {
        if (this.state !== VideoBroadcast.STATES.CAPTURING) return;

        this._framesBroadcast.stopPlayback();
        this._audioBroadcast.stopPlayback();
        this._socketEvents.close();

        this.state = VideoBroadcast.STATES.WAITiNG;
    };

    VideoBroadcast.prototype.stop = function() {
        if (this.state !== VideoBroadcast.BROADCASTING) return;

        this._framesBroadcast.stop();
        this._audioBroadcast.stop();
        this._closeStream(this._audioStream);
        this._closeStream(this._videoStream);
        this._socketEvents.send(this._room + '/stop');

        this.state = VideoBroadcast.STATES.WAITiNG;
    };

    VideoBroadcast.prototype._closeStream = function(stream) {
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
    };

    VideoBroadcast.prototype.subscribe = function(onstart, onstop) {
        if (this.state !== VideoBroadcast.STATES.WAITiNG) return;

        var self = this;
        this._socketEvents.open(this._url, function() {
            self.state = VideoBroadcast.STATES.CAPTURING;
            self._socketEvents.setBinaryType('blob');

            var delayFrames = true;
            self._socketEvents.on(self._room + '/restart', function() {
                delayFrames = true;
            });

            self._socketEvents.on(self._room + '/stop', function() {
                if (onstop) onstop();
                self._framesBroadcast.stopPlayback();
                self._audioBroadcast.stopPlayback();
            });

            self._socketEvents.on(self._room + '/frames', function(frame) {
                self._framesBroadcast.pushFrame(frame);
                if (delayFrames) {
                    delayFrames = false;
                    setTimeout(function() {
                        if (onstart) onstart();
                        self._framesBroadcast.startPlayback();
                    }, self._delay);
                }
            });

            self._socketEvents.on(self._room + '/audio', function(chunk) {
                self._audioBroadcast.playChunk(chunk);
            });
        });
    };

    VideoBroadcast.prototype._handleAudioStream = function(stream) {
        var self = this;
        this._audioBroadcast.handleStream(stream);
        this._audioBroadcast.onchunk = function(chunk) {
            self._socketEvents.sendBinary(self._room + '/audio', chunk);
        };
    };

    VideoBroadcast.prototype._handleVideoStream = function(stream) {
        var self = this;
        this._socketEvents.send(this._room + '/restart');
        this._framesBroadcast.handleStream(stream);
        this._framesBroadcast.onframe = function(frame) {
            self._socketEvents.send(self._room + '/frames', frame);
        };
    };


    /*
     * AUDIO BROADCAST
     */
    function AudioBroadcast(options) {
        this._delay = options.delay || 3000;
        this._audio = new Audio();
    }

    AudioBroadcast.AUDIO_TYPE = 'audio/ogg; codecs=opus';

    AudioBroadcast.prototype.handleStream = function(stream) {
        var self = this;
        var mediaRecorder = new MediaRecorder(stream);
        this._mediaRecorder = mediaRecorder;
        var chunks = [];

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        };

        mediaRecorder.onstop = function() {
            var blob = new Blob(chunks, {type: AudioBroadcast.AUDIO_TYPE});
            self.onchunk(blob);
            chunks = [];
        };

        mediaRecorder.start();
        this._interval = setInterval(function() {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, this._delay);
    };

    AudioBroadcast.prototype.onchunk = function(chunk) {};

    AudioBroadcast.prototype.playChunk = function(chunk) {
        this._audio.src = URL.createObjectURL(chunk);
        this._audio.play();
    };

    AudioBroadcast.prototype.stop = function() {
        if (this._mediaRecorder) {
            this._mediaRecorder.stop();
        }
        clearInterval(this._interval);
    };

    AudioBroadcast.prototype.stopPlayback = function() {
        this._audio.pause();
    };

    /*
     * FRAMES BROADCAST
     */
    function FramesBroadcast(options) {
        this.render(options);

        this._framesQueue = [];
        this._width = options.width;
        this._height = options.height;
        this._timeout = options.fps ? 1000 / options.fps : 50;
    }

    FramesBroadcast.FRAME_TYPE = 'image/jpeg';

    FramesBroadcast.prototype.render = function(options) {
        this.videoElement = options.videoElement || this._renderVideo();
        this.imageElement = options.imageElement || this._renderImage();

        var canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        this._canvas = canvas;

        this.videoElement.parentNode.insertBefore(canvas, this.videoElement);
    };

    FramesBroadcast.prototype._renderVideo = function() {
        var video = document.createElement('video');

        document.body.appendChild(video);
        return video;
    };

    FramesBroadcast.prototype._renderImage = function() {
        var img = document.createElement('img');

        document.body.appendChild(img);
        return img;
    };

    FramesBroadcast.prototype.stop = function() {
        this.videoElement.pause();
        clearInterval(this._interval);
    };

    FramesBroadcast.prototype.handleStream = function(stream) {
        var self = this;
        this.videoElement.srcObject = stream;
        this.videoElement.play();

        this.videoElement.addEventListener('canplay', function init() {
            self.videoElement.removeEventListener('canplay', init);

            var dimensions = self._resolveDimensions();
            var width = dimensions.width;
            var height = dimensions.height;

            self.videoElement.setAttribute('width', width);
            self.videoElement.setAttribute('height', height);
            self._canvas.setAttribute('width', width);
            self._canvas.setAttribute('height', height);

            self._interval = setInterval(function() {
                var context = self._canvas.getContext('2d');
                context.drawImage(self.videoElement, 0, 0, width, height);

                var dataURL = self._canvas.toDataURL(FramesBroadcast.FRAME_TYPE);
                self.onframe(dataURL);
            }, self._timeout);
        });
    };

    FramesBroadcast.prototype.onframe = function(frame) {};

    FramesBroadcast.prototype.pushFrame = function(frame) {
        this._framesQueue.push(frame);
    };

    FramesBroadcast.prototype.startPlayback = function() {
        var self = this;
        this._playbackInterval = setInterval(function() {
            if (self._framesQueue.length) {
                self.imageElement.src = self._framesQueue.shift();
            }
        }, this._timeout);
    };

    FramesBroadcast.prototype.stopPlayback = function() {
        clearInterval(this._playbackInterval);
        this._framesQueue = [];
    };

    FramesBroadcast.prototype._resolveDimensions = function() {
        var video = this.videoElement, width = this._width, height = this._height;
        if (!(width && height)) {
            if (width) {
                height = video.videoHeight / (video.videoWidth / width);
            } else if (height) {
                width = video.videoWidth / (video.videoHeight / height);
            } else {
                width = video.videoWidth;
                height = video.videoHeight;
            }
        }
        return {
            width: width,
            height: height
        };
    };

    return VideoBroadcast;
})(window, undefined);