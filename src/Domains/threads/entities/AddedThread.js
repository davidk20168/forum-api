/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class AddedThread {
  constructor(ownerId, payload) {
    this._verifyPayload(payload);

    const { id, title, body } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = ownerId;
  }

  _verifyPayload({ id, title, body }) {
    if (!id || !title || !body) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
