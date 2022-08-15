/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
// id, title, body, date, owner
const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'thread dicoding', body = 'dicoding body', owner = 'user-123',
  }) {
    const threadDate = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, threadDate, owner],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
