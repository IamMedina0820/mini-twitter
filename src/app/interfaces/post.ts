export interface Post {
    message: string;
    created: Date;
    commets?: {
        id: number,
        message: string,
        created: Date,
        user: string
        likes: {
            user: number,
            like: boolean,
        }
    };
    likes?: {
        user: number,
        like: boolean,
    };
    uid: string;
    pid: string;
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