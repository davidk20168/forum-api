/* eslint-disable no-underscore-dangle */
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getThreadDetail(threadId) {
    const query = {
      text: 'SELECT threads.id, title, body, thread_date as date, username FROM threads LEFT JOIN users ON users.id = threads.owner WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async verifyThreadId(threadId) {
    const query = {
      text: 'SELECT id, title, body, owner FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addThread(addThread) {
    const { owner, title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const threadDate = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, thread_date, owner',
      values: [id, title, body, threadDate, owner],
    };
    const resultQuery = await this._pool.query(query);

    return new AddedThread(owner, resultQuery.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
