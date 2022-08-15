/* eslint-disable max-len */
/* eslint-disable no-undef */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const DetailThreadUseCase = require('../ThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should get return detail thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-h_2FkLZhtgBKY2kh4CC02',
    };

    const thread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const expectedThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const payloadComment = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isdelete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
        isdelete: true,
      },
    ];

    const expectedComment = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isdelete: false,
      },
      {
        id: 'comment-yksuCoxM2s4MMrZJO-qVD',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: '**komentar telah dihapus**',
        isdelete: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest.fn(() => Promise.resolve(thread));
    mockCommentRepository.getCommentDetail = jest.fn(() => Promise.resolve(payloadComment));
    mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve(payloadComment));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    const detailThread = await detailThreadUseCase.getThreadDetail(useCasePayload.thread);

    const threadId = useCasePayload.thread;
    expect(mockThreadRepository.getThreadDetail).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentDetail).toBeCalledWith(threadId);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);

    expect(detailThread).toStrictEqual({
      thread: {
        id: expectedThread.id,
        title: expectedThread.title,
        body: expectedThread.body,
        date: expectedThread.date,
        username: expectedThread.username,
        comments: expectedComment,
      },
    });
  });
});
