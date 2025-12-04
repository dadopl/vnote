module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rawText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'raw_text'
    },
    transformedText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'transformed_text'
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'default'
    },
    customInstruction: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'custom_instruction'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'notes',
    timestamps: true,
    underscored: true
  });

  Note.associate = (models) => {
    Note.hasMany(models.Recording, {
      foreignKey: 'noteId',
      as: 'recordings'
    });
    Note.hasMany(models.TtsGeneration, {
      foreignKey: 'noteId',
      as: 'ttsGenerations'
    });
  };

  return Note;
};

