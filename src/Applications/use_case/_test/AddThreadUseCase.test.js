/* eslint-disable max-len */
/* eslint-disable no-undef */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddThreadUseCase = require('../ThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const ownerId = 'user-123';
    const useCasePayload = {
      title: 'A thread',
      body: 'A thread body',
    };

    const expectedAddedThread = new AddedThread(ownerId, {
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread(ownerId, {
        id: 'thread-123',
        title: 'A thread',
        body: 'A thread body',
      })));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.addThread(ownerId, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(ownerId, useCasePayload));
  });
});
