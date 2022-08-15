/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const AddCommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const ownerId = request.auth.credentials.id;
    const { threadId } = request.params;
    const payload = {
      content: request.payload.content,
    };
    const { content } = payload;
    // const addedThread = await addThreadUseCase.addThread(ownerId, { title, body });
    const addedComment = await addCommentUseCase.addComment(ownerId, threadId, { content });
    // const addedComment = await addCommentUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(201);
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    const ownerId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;
    await deleteCommentUseCase.deleteComment(threadId, commentId, ownerId);
    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
