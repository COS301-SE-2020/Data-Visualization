const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            'primary-color': 'black',
                            'menu-item-height': '10px',
                            'menu-item-vertical-margin': '4px'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};