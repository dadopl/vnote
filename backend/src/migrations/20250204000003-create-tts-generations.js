'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tts_generations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      note_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'notes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      audio_path: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      voice_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      voice_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      model_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      text_length: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on note_id for faster joins
    await queryInterface.addIndex('tts_generations', ['note_id']);
    // Add index on created_at for sorting
    await queryInterface.addIndex('tts_generations', ['created_at']);
    // Add index on voice_id for filtering by voice
    await queryInterface.addIndex('tts_generations', ['voice_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tts_generations');
  }
};

