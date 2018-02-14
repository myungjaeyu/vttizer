export var SMIParser = (subtitle) => {
    let data = [];

    let cue = subtitle.match(/(<SYNC[^]*?)(?=\s*<SYNC|\s*<\/BODY)/gi)
                      .map(e => e.match(/<SYNC Start=(\d+)><P.*>(.*)?/));

    cue.forEach( (e, i) => {

        data.push({
            id : i + 1,
            start : (e[1]) / 1000,
            end   : (cue[i+1] ? cue[i+1][1] : e[1]) / 1000,
            text  : e[2]
        });

    });

    return data;
};