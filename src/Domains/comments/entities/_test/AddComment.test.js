/* eslint-disable no-undef */
const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = {};
    const payload = {};
    const threadId = {};

    // Action and Assert
    expect(() => new AddComment(userId, threadId, payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {};
    const threadId = 'thread-123';

    // Action and Assert
    expect(() => new AddComment(userId, threadId, payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {};
    const threadId = 'thread-123';

    // Action and Assert
    expect(() => new AddComment(userId, threadId, payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddComment(userId, threadId, payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new thread object correctly', () => {
    const userId = 'user-123';
    const threadidPayload = 'thread-123';
    const payload = {
      content: 'A Comment',
    };

    const { threadId, owner, content } = new AddComment(userId, threadidPayload, payload);

    expect(content).toEqual(content);
    expect(userId).toEqual(owner);
    expect(threadId).toEqual(threadidPayload);
  });
});
