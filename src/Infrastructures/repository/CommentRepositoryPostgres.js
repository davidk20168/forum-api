/* eslint-disable no-underscore-dangle */
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments set is_delete = TRUE WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async verifyOwnerId(threadId, commentId, ownerId) {
    // text: 'SELECT id, content, thread_id, owner, is_delete FROM comments WHERE id = $1',
    const query = {
      text: `SELECT id, content, thread_id, owner, is_delete FROM comments 
              WHERE id = $1 AND thread_id = $2 AND owner = $3`,
      values: [commentId, threadId, ownerId],
    };

    const resultQuery = await this._pool.query(query);

    if (!resultQuery.rowCount) {
      throw new AuthorizationError('User tidak authorize untuk comment ini');
    }
  }

  async verifyCommentId(commentId) {
    const query = {
      text: 'SELECT id, content, thread_id, owner, is_delete FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak tersedia');
    }
  }

  async getCommentDetail(threadId) {
    const query = {
      text: `SELECT comments.id as id, users.username as username, comments.comment_date as date, 
            comments.content as content, comments.is_delete as isDelete 
            FROM comments LEFT JOIN users ON users.id = comments.owner WHERE thread_id = $1
            ORDER BY comment_date ASC`,
      values: [threadId],
    };

    const resultQuery = await this._pool.query(query);

    return resultQuery.rows;
  }

  async addComment(addComment) {
    const { owner, threadId, content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const threadDate = new Date().toISOString();

    const query = {
      text: `INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) 
            RETURNING id, content, comment_date, thread_id, owner, is_delete`,
      values: [id, content, threadDate, threadId, owner, 0],
    };

    const resultQuery = await this._pool.query(query);
    const result = {
      id: resultQuery.rows[0].id,
      threadId: resultQuery.rows[0].thread_id,
      content: resultQuery.rows[0].content,
      owner: resultQuery.rows[0].owner,
    };

    return new AddedComment(owner, threadId, result);
  }
}

module.exports = CommentRepositoryPostgres;
