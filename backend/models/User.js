const db = require('./index');

// const User = (sequelize, DataTypes)=>{
//     sequelize.define('User', {
//         name: {
//             type: DataTypes.STRING,
//         },
//     })

// }
const User = db.sequelize.define('User', {
    name: {
        type: db.Sequelize.DataTypes.STRING
    }
})
module.exports = User