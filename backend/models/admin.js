'use strict';
const bcryptjs = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          const salt = await bcryptjs.genSalt(10);
          admin.password = await bcryptjs.hash(admin.password, salt);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          const salt = await bcryptjs.genSalt(10);
          admin.password = await bcryptjs.hash(admin.password, salt);
        }
      }
    }
  });

  Admin.prototype.comparePassword = async function(password) {
    return bcryptjs.compare(password, this.password);
  };

  return Admin;
};