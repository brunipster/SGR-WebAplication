const bcrypt = require('bcryptjs');
const moment = require('moment');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savePassword) => {
    try {
        return await bcrypt.compare(password, savePassword);
    } catch (error) {
        console.log(error)
    }
}

helpers.formatDateSqlToJs = (date) => {
    moment.locale('es');
    return moment(date).format('YYYY-MM-DD');
}

helpers.formatDateJsToSql = (date) => {
    moment.locale('es');
    return moment(moment(date, 'YYYY-MM-DD')).format("YYYY-MM-DD");;
}
module.exports = helpers