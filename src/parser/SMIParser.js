export var SMIParser = (subtitle) => {
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