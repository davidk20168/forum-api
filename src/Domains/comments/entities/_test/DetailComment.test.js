/* eslint-disable no-undef */
const CommentDetail = require('../DetailComment');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
    };

    expect(() => new CommentDetail(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      comments: {},
    };

    expect(() => new CommentDetail(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    const expectedPayload = {
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          isdelete: false,
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
          isdelete: true,
        },
      ],
    };

    const { comments } = new CommentDetail(expectedPayload);
    expect(comments).toEqual(expectedPayload.comments);
  });
});
