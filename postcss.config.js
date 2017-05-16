const paths = {
  src: 'node_modules/lsv-components/src'
};

module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ }),
    require('postcss-map')({
      maps: [
        `${paths.src}/tokens/borders.json`,
        `${paths.src}/tokens/breakpoints.json`,
        `${paths.src}/tokens/colors.json`,
        `${paths.src}/tokens/fonts.json`,
        `${paths.src}/tokens/layers.json`,
        `${paths.src}/tokens/sizes.json`,
        `${paths.src}/tokens/spaces.json`,
      ],
    })
  ]
};
