/* eslint-disable no-undef */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

// missing authentication - done
// thread id ada, user login, payload tdk lengkap ( required data ) - done
// thread not found - done
// does not meet required data specification - done
// add data - done

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('response 401 if user is not registered and login', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/abc/comments',
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
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Properti menambahkan comment tidak lengkap');
    });

    it('response 404 thread ID not found', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      let threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });

      threadId = 'thread-1234';
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('response 400 data type payload data ', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 123,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tipe data properti salah');
    });

    it('response 201 if success added comment', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
    });
  });

  /* delete comment */
  describe('when DELETE /comments', () => {
    it('response 404 delete comment thread ID not found', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      let threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      responseJson = JSON.parse(responseComment.payload);
      threadId = 'thread-1234';
      const commentId = 'comment-123';
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('response 404 delete comment where comment ID not found', async () => {
      // Arrange
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      // Action
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });

      const commentId = 'comment-123';
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Comment tidak tersedia');
    });

    it('response 403 delete comment where user not authorize to delete', async () => {
      // register and login user 1
      const server = await createServer(container);
      let requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      let responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      let userId = responseJson.data.addedUser.id;
      let responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      let { accessToken } = responseJson.data;
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      responseJson = JSON.parse(responseComment.payload);
      // console.log(responseJson);
      const commentId = responseJson.data.addedComment.id;

      // register and login 2nd user
      requestUserPayload = {
        username: 'dicodingdua',
        password: 'secret',
      };
      responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingdua',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      responseJson = JSON.parse(responseUser.payload);
      userId = responseJson.data.addedUser.id;

      responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      accessToken = responseJson.data.accessToken;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('User tidak authorize untuk comment ini');
    });

    it('response 200 delete comment where delete comment is success', async () => {
      // register and login user 1
      const server = await createServer(container);
      const requestUserPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const responseUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      let responseJson = JSON.parse(responseUser.payload);
      const userId = responseJson.data.addedUser.id;
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestUserPayload,
      });
      responseJson = JSON.parse(responseAuth.payload);
      const { accessToken } = responseJson.data;
      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({
        id: threadId, title: 'thread dicoding', body: 'dicoding body', owner: userId,
      });
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah comment',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      responseJson = JSON.parse(responseComment.payload);
      const commentId = responseJson.data.addedComment.id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
