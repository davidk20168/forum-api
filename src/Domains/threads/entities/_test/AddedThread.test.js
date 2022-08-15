/* eslint-disable no-undef */
const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 123,
      body: 'A thread body',
    };

    // Action and Assert
    const ownerId = 'user-123';
    expect(() => new AddedThread(ownerId, payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: {},
      title: 'A thread',
    };

    // Action and Assert
    const ownerId = 'user-123';
    expect(() => new AddedThread(ownerId, payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A thread',
      body: 123,
    };

    // Action and Assert
    const ownerId = 'user-123';
    expect(() => new AddedThread(ownerId, payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 123,
      body: 'A thread body',
    };

    // Action and Assert
    const ownerId = 'user-123';
    expect(() => new AddedThread(ownerId, payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
    };

    // Action
    const ownerId = 'user-123';
    const addedThread = new AddedThread(ownerId, payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(ownerId);
  });
});
