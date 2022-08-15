/* eslint-disable no-undef */
const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  /*
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = '';
    const payload = {};

    // Action and Assert
expect(() => new AddThread(userId, payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  */

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      body: 'A body',
    };

    // Action and Assert
    expect(() => new AddThread(userId, payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 'A thread',
    };

    // Action and Assert
    expect(() => new AddThread(userId, payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 123,
      body: 'A body',
    };

    // Action and Assert
    expect(() => new AddThread(userId, payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userId = 'user-123';
    const payload = {
      title: 'A thread',
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(userId, payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new thread object correctly', () => {
    const userId = 'user-123';
    const payload = {
      title: 'A thread',
      body: 'A Body',
    };

    const { owner, title, body } = new AddThread(userId, payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(userId);
  });
});
