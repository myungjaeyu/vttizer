import { VTTParser, SRTParser } from './parser/index';

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
            case 'smi' : return [];
            default : return [];
        }

    }

    render(videoElement) {
        this.videoElement = videoElement;

        this.track = this.videoElement.addTextTrack('captions');
        this.track.mode = 'showing';

        this.data.forEach(
            e => this.track.addCue(new VTTCue(e.start, e.end, e.text))
        );

    }

}

export default Vttizer;