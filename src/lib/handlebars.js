const {format} = require('timeago.js');
const moment = require('moment');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp)
};

helpers.momentjs = (date, format) => {
    moment.locale('es');
    return moment(date).format(format);
}

module.exports = helpers;