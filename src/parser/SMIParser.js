export var SMIParser = (subtitle) => {
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