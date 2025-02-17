'use strict';

module.exports = (sequelize, DataTypes) => {
  const ParentId = sequelize.define('ParentId', {
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      }
    },
    parent_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    }
  }, {
    tableName: 'parent_ids',
    underscored: true,
  });

  ParentId.associate = (models) => {
    ParentId.belongsTo(models.Member, {
      foreignKey: 'member_id',
      as: 'member'
    });
  };

  return ParentId;
};
