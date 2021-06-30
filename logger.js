const bunyan = require('bunyan');
const moment = require('moment');

const log = bunyan.createLogger({
  time:  moment().format("YYYY-MM-DD HH:mm:ss.SSSS"),
  name: "cat-cards",
  src: true,
  env: "dev",
  streams: [

    {
      type: 'rotating-file',
      period: '1d',
      gzip: true,
      path:  'cat-card.log'
    },
    {

      period: '1d',
      stream: process.stdout
    }

  ]
});

module.exports = log;

