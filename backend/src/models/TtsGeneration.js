module.exports = (sequelize, DataTypes) => {
  const TtsGeneration = sequelize.define('TtsGeneration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    noteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'note_id',
      references: {
        model: 'notes',
        key: 'id'
      }
    },
    audioPath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'audio_path'
    },
    voiceId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'voice_id'
    },
    voiceName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'voice_name'
    },
    modelId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'model_id'
    },
    textLength: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'text_length'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'tts_generations',
    timestamps: false,
    underscored: true
  });

  TtsGeneration.associate = (models) => {
    TtsGeneration.belongsTo(models.Note, {
      foreignKey: 'noteId',
      as: 'note'
    });
  };

  return TtsGeneration;
};

