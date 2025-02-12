'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    parent_id: {  
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'members', 
    timestamps: true, 
    underscored: true, 
  });

  return Member;
};
