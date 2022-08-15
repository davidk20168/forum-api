/* eslint-disable max-len */
/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DetailCommentUseCase = require('../CommentUseCase');

describe('DetailCommentUseCase', () => {
  it('should get return detail comment correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
    };

    const commentPayload = {
      comments:
        [
          {
            id: 'comment-123',
            username: 'johndoe',
            date: '2022-08-04 14.00',
            content: 'sebuah comment',
          },
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-08-04 14.00',
            content: '**komentar telah dihapus**',
          }],
    };

    const expectedComment = {
      comments:
        [
          {
            id: 'comment-123',
            username: 'johndoe',
            date: '2022-08-04 14.00',
            content: 'sebuah comment',
          },
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-08-04 14.00',
            content: '**komentar telah dihapus**',
          }],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    let threadId = 'thread-123';
    mockThreadRepository.verifyThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentDetail = jest.fn().mockImplementation(() => Promise.resolve(commentPayload));

    const detailCommentUseCase = new DetailCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // action
    const detailComment = await detailCommentUseCase.getCommentDetail(useCasePayload.thread);

    threadId = useCasePayload.thread;
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(threadId);
    expect(detailComment).toEqual(expectedComment);
  });
});
