import { VTTParser } from './parser/index';

class Vttizer {
    
    constructor(subtitle, format) {

        this.subtitle = subtitle;
        this.format = format || 'vtt';
        this.data = this._process(this.format, this.subtitle);

    }

    _process(format, subtitle) {

        switch(format) {
            case 'vtt' : return VTTParser(subtitle);
            case 'srt' : return [];
            case 'smi' : return [];
            default : return [];
        }

    }

}

export default Vttizer;