/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class AddComment {
  constructor(owner, threadId, payload) {
    this._verifyPayload(owner, payload);

    const { content } = payload;

    this.threadId = threadId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload(owner, { content }) {
    if (!owner || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
