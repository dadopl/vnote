module.exports = (sequelize, DataTypes) => {
  const Recording = sequelize.define('Recording', {
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
    originalAudioPath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'original_audio_path'
    },
    ttsAudioPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'tts_audio_path'
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'recordings',
    timestamps: true,
    underscored: true
  });

  Recording.associate = (models) => {
    Recording.belongsTo(models.Note, {
      foreignKey: 'noteId',
      as: 'note'
    });
  };

  return Recording;
};

