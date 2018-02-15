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

    let cue = subtitle.replace(/(\r\n|\n|\r)/gm, '')
                        .match(/(<SYNC[^]*?)(?=\s*<SYNC|\s*<\/BODY)/gi)
                        .map(e => [ +e.split('><')[0].replace('<SYNC Start=', ''), e.split('><')[1]
                        .replace(/<br>/g, '\n')
                        .split('>')[1]]);

    cue.forEach( (e, i) => {

        data.push({
            id : i + 1,
            start : (e[0]) / 1000,
            end   : (cue[i+1] ? cue[i+1][0] : e[0]) / 1000,
            text  : e[1]
        });

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
