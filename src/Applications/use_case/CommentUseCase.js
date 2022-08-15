/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const AddComment = require('../../Domains/comments/entities/AddComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addComment(ownerId, threadId, content) {
    await this._threadRepository.verifyThreadId(threadId);
    const addComment = new AddComment(ownerId, threadId, content);
    return this._commentRepository.addComment(addComment);
  }

  async deleteComment(threadId, commentId, ownerId) {
    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentId(commentId);
    await this._commentRepository.verifyOwnerId(threadId, commentId, ownerId);
    await this._commentRepository.deleteComment(commentId);
  }

  async getCommentDetail(threadId) {
    await this._threadRepository.verifyThreadId(threadId);
    const detailComment = new DetailComment(await this._commentRepository.getCommentDetail(threadId));
    return detailComment;
  }
}

module.exports = CommentUseCase;
