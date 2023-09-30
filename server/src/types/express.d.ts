declare namespace Express {
  export interface Request {
    user: any;
  }
  namespace Multer {
    interface File extends Request.file {
      smallBuffer?: Buffer;
    }
  }
}
