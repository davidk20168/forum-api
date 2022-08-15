/* eslint-disable max-len */
/* eslint-disable no-undef */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddCommentUseCase = require('../CommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const useCasePayload = {
      content: 'content thread',
    };

    const expectedAddedComment = new AddedComment(ownerId, threadId, {
      id: commentId,
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment(ownerId, threadId, {
        id: commentId,
        content: useCasePayload.content,
      })));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.addComment(ownerId, threadId, useCasePayload);
    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(ownerId, threadId, useCasePayload));
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
  });
});
