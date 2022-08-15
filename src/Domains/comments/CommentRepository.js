/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class CommentRepository {
  async addComment(addComment) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentId(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyOwnerId(threadId, userId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentDetail(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
