/* eslint-disable no-underscore-dangle */
const AddThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const ownerId = request.auth.credentials.id;

    const payload = {
      title: request.payload.title,
      body: request.payload.body,
    };
    const { title, body } = payload;
    const addedThread = await addThreadUseCase.addThread(ownerId, { title, body });
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const { threadId } = request.params;
    const threadDetail = await getThreadDetailUseCase.getThreadDetail(threadId);

    const response = h.response({
      status: 'success',
      data: threadDetail,
      /*
        data: {
          threadDetail,
        },
        */
    });
    return response;
  }
}

module.exports = ThreadsHandler;
