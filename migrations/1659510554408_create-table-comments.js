/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    comment_date: {
      type: 'VARCHAR(32)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint('comments', 'fk_comments.owwer_owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_id_thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
