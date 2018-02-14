import uglify from 'rollup-plugin-uglify-es';

export default [
    { 
        input       : './src/index.js',
        output      : {
            file : 'dist/vttizer.min.js',
            format      : 'umd',
            name  : 'Vttizer'
        },
        plugins     : [ uglify() ]
    },
    { 
        input       : './src/index.js',
        output      : {
            file : 'dist/vttizer.js',
            format      : 'umd',
            name  : 'Vttizer'
        }
        // , sourceMap   : 'inline'
    }
];