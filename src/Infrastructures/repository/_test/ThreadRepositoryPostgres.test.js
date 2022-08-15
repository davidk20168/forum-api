/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadsRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyThreadId function', () => {
    it('should throw InvariantError when thread not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId('thread-123'))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });

    it('should not throw InvariantError when thread available', async () => {
      // Arrange
      const threadId = 'thread-1234';
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId(threadId))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const ownerId = 'user-123';
      const addThread = new AddThread(ownerId, {
        title: 'thread title',
        body: 'thread body',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const ownerId = 'user-123';
      const addThread = new AddThread(ownerId, {
        owner: 'user-123',
        title: 'thread title',
        body: 'thread body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread(ownerId, {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      }));
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadDetail function', () => {
    it('should return thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      const expectedPayload = {
        id: 'thread-123', title: 'thread dicoding', body: 'dicoding body', username: 'dicoding',
      };
      const threadRepositoryPostgres = new ThreadsRepositoryPostgres(pool, {});

      // Action & assert
      const detailThread = await threadRepositoryPostgres.getThreadDetail('thread-123');

      expect(detailThread.id).toEqual(expectedPayload.id);
      expect(detailThread.title).toEqual(expectedPayload.title);
      expect(detailThread.body).toEqual(expectedPayload.body);
      expect(detailThread.username).toEqual(expectedPayload.username);
    });
  });
});
