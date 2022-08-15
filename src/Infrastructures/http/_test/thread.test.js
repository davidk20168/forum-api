/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('response 401 if user is not registered and login', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('response 400 if user login but properties not meet data', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const { accessToken } = JSON.parse(responseAuth.payload).data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread 123',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Properti menambahkan thread tidak lengkap');
    });

    it('response 400 if user login but properties not meet data', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const { accessToken } = JSON.parse(responseAuth.payload).data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread 123',
          body: 123,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tipe data properti salah');
    });

    it('response 201 if success added thread', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });

      const { accessToken } = JSON.parse(responseAuth.payload).data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread 123',
          body: 'sebuah thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('get response 404 when thread ID not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/abc',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message.length).not.toEqual(0);
    });

    it('get response 200 when thread ID found', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const threadId = 'thread-321';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'comment dicoding', thread_id: threadId, owner: 'user-123', is_delete: false,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });
  });
});
