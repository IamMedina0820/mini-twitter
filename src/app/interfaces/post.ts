export interface Post {
    message: string;
    created: Date;
    comments?: Comment[];
    likes: Like;
    uid: string;
    pid: string;
}

export interface Comment {
  cid: string;
  pid: string;
    message: string;
    created: Date;
    uid: string;
    likes: CommentLike[];
}

export interface Like {
  uid: string;
  userName: string;
  liked: boolean;
  photo: string;
}

export interface CommentLike {
  uid: string;
  cid: string;
  liked: boolean;
}

  // public post = {
  //   message: '',
  //   created: new Date(),
  //   commets: {
  //       uid: '',
  //       message: '',
  //       created: new Date(),
  //       user: '',
  //       likes: {
  //           user: 1,
  //           like: false,
  //       }
  //   },
  //   likes: {
  //       uid: '',
  //       user: '',
  //       like: false,
  //   },
  //   uid: '',
  // };
