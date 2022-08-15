/* eslint-disable no-undef */
const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action and Assert
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    expect(() => new AddedComment(ownerId, threadId, payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
    };

    // Action and Assert
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    expect(() => new AddedComment(ownerId, threadId, payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content thread',
    };

    // Action
    const ownerId = 'user-123';
    const threadId = 'thread-123';
    const addedComment = new AddedComment(ownerId, threadId, payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(ownerId);
    expect(addedComment.threadId).toEqual(threadId);
  });
});
