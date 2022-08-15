/* eslint-disable max-len */
/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DeleteCommentUseCase = require('../CommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    /** arrange */
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentId = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwnerId = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    await deleteCommentUseCase.deleteComment(threadId, commentId, ownerId);

    // Assert
    expect(mockThreadRepository.verifyThreadId).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentId).toHaveBeenCalledWith(commentId);
    expect(mockCommentRepository.verifyOwnerId).toHaveBeenCalledWith(threadId, commentId, ownerId);
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(commentId);
  });
});
