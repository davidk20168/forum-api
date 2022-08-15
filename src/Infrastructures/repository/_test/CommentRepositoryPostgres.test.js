/* eslint-disable max-len */
/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentsRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const { payload } = require('@hapi/hapi/lib/validation');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentId function', () => {
    it('should throw InvariantError when comment not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment dicoding', thread_id: 'thread-123', owner: 'user-123', is_delete: false,
      });
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId('comment-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });

    it('should not throw InvariantError when comment available', async () => {
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const addComment = new AddComment(ownerId, threadId, {
        content: 'sebuah comment',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const testResultComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(testResultComment).toHaveLength(1);

      const commentPayload = {
        id: 'comment-123',
        content: 'sebuah comment',
      };

      expect(addedComment).toStrictEqual(new AddedComment(ownerId, threadId, commentPayload));

      const testAddedComment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(testAddedComment).toHaveLength(1);
    });
  });

  describe('verifyOwnerId function', () => {
    it('should throw AuthorizationError when owner comment not authorize', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment dicoding', thread_id: 'thread-123', owner: 'user-123', is_delete: false,
      });
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwnerId('comment-123', 'thread-123', 'user-321')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw InvariantError when owner comment is authorize', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment dicoding', thread_id: 'thread-123', owner: 'user-123', is_delete: false,
      });
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyOwnerId('thread-123', 'comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should update is_delete comment from database', async () => {
      // arrange
      const commentRepository = new CommentsRepositoryPostgres(pool);
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment dicoding', thread_id: 'thread-123', owner: 'user-123', is_delete: false,
      });

      // action
      await commentRepository.deleteComment('comment-123');
      // asert
      const testQuery = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(testQuery[0].is_delete).toEqual(true);
      // expect(testQuery[0].content).toEqual('**komentar telah dihapus**');
    });
  });

  describe('getCommentDetail function', () => {
    it('should return comment id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment dicoding 1', thread_id: 'thread-123', owner: 'user-123', is_delete: false,
      });
      const commentRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

      // Action
      const detailComment = await commentRepositoryPostgres.getCommentDetail('thread-123');

      // Assert
      expect(detailComment).toHaveLength(1);
      expect(detailComment[0].id).toEqual('comment-123');
      expect(detailComment[0].content).toEqual('comment dicoding 1');
      expect(detailComment[0].username).toEqual('dicoding');
      expect(detailComment[0].isdelete).toEqual(false);
    });
  });
});
