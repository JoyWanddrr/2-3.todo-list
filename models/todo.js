'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    name: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN
  }, {});
  Todo.associate = function (models) {
    Todo.belongsTo(models.User, {
      // 寫出FK是誰，不然會一直說userId沒有輸入。
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    }
    )
  };
  return Todo;
};