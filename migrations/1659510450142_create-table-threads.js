/* eslint-disable camelcase */

exports.shorthands = undefined;
// id, title, body, date, owner
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    thread_date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('threads', 'fk_threads.owwer_owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
