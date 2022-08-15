/* eslint-disable no-underscore-dangle */
const AddThread = require('../../Domains/threads/entities/AddThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class ThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    userRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async addThread(userId, { title, body }) {
    const addThread = new AddThread(userId, { title, body });
    return this._threadRepository.addThread(addThread);
  }

  async getThreadDetail(threadId) {
    await this._threadRepository.verifyThreadId(threadId);
    const detailThread = await this._threadRepository.getThreadDetail(threadId);

    const detailComment = await this._commentRepository.getCommentDetail(threadId);
    const commentsResult = {
      comments: detailComment,
    };
    detailThread.comments = new DetailComment(commentsResult).comments;
    return {
      thread: detailThread,
    };
  }
}

module.exports = ThreadUseCase;
