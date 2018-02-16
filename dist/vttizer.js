(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vttizer = factory());
}(this, (function () { 'use strict';

var VTTParser = (subtitle) => {
    let data = [];

    subtitle.split('\n')
            .slice(1)
            .join('\n')
            .replace(/\r+/g, '') // new line
            .replace(/^\s+|\s+$/g, '') // trim
            .split('\n\n')
            .forEach(e => {
                let cue = e.split(/\n/).filter(e => e),
                m = cue[1].match(/(\d+):(\d+):(\d+)(?:.(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:.(\d+))?/);

                data.push({
                    id : cue[0],
                    start : (parseInt(m[1], 10) * 60 * 60) + (parseInt(m[2], 10) * 60) + (parseInt(m[3], 10)) + (parseInt(m[4], 10) / 1000),
                    end   : (parseInt(m[5], 10) * 60 * 60) + (parseInt(m[6], 10) * 60) + (parseInt(m[7], 10)) + (parseInt(m[8], 10) / 1000),
                    text  : cue.filter( (e, i) => i > 1).join('\n')
                });
            });

    return data;
};

var SRTParser = (subtitle) => {
    let data = [];

    subtitle.replace(/\r+/g, '') // new line
            .replace(/^\s+|\s+$/g, '') // trim
            .split('\n\n')
            .forEach(e => {
                let cue = e.split(/\n/).filter(e => e),
                    m = cue[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);

                data.push({
                    id : cue[0],
                    start : (parseInt(m[1], 10) * 60 * 60) + (parseInt(m[2], 10) * 60) + (parseInt(m[3], 10)) + (parseInt(m[4], 10) / 1000),
                    end   : (parseInt(m[5], 10) * 60 * 60) + (parseInt(m[6], 10) * 60) + (parseInt(m[7], 10)) + (parseInt(m[8], 10) / 1000),
                    text  : cue.filter( (e, i) => i > 1).join('\n')
                });
            });

    return data;
};

var SMIParser = (subtitle) => {
    let data = [];

    let doc  = new DOMParser().parseFromString(subtitle, 'text/html'),
        _cue = [],
        cue  = [];

    Array.from(doc.body.querySelectorAll('sync'))
        .map( e => {
            let item = [ e.getAttribute('start'), e.parentElement.tagName === 'P' ? e.parentElement.innerText.split('').slice(0, -1).join('').replace(/^\s+|\s+$/g, '') : '' ];
            _cue.push(item);
            return item;
        })
        .map((e, i) => {

            while(e[1][0] === '\n') e[1] = e[1].slice(1);

            if(i !== 0) cue.push([ _cue[i-1][0], e[1].replace(/\n\n/g, '\n') ]);
            if(i === _cue.length-1) cue.push([e[0], '']);
        })
        .forEach((e, i) => {
            
            e = cue[i];
            
            if(e[1]) {

                data.push({
                    id : i + 1,
                    start : (e[0]) / 1000,
                    end   : (cue[i + 1] ? cue[i + 1][0] : e[0]) / 1000,
                    text  : e[1]
                });

            }

        });

    return data;
};

class Vttizer {
    
    constructor(subtitle, format) {

        this.subtitle = subtitle;
        this.format = format || 'vtt';
        this.data = this._process(this.format, this.subtitle);
        this.videoElement;
        this.track;

    }

    _process(format, subtitle) {

        switch(format) {
            case 'vtt' : return VTTParser(subtitle);
            case 'srt' : return SRTParser(subtitle);
            case 'smi' : return SMIParser(subtitle);
            default : return [];
        }

    }

    render(videoElement) {
        this.videoElement = videoElement;

        this.track = this.videoElement.addTextTrack('captions');
        this.track.mode = 'showing';

        Array.from(this.videoElement.textTracks).filter(e => e !== this.track).map(e => e.mode = 'hidden');

        this.data.forEach(
            e => this.track.addCue(new VTTCue(e.start, e.end, e.text))
        );

    }

}

return Vttizer;

})));
