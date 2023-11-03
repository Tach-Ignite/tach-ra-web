export class ErrorWithStatusCode extends Error {
  statusCode: number;

  friendlyMessage: string;

  constructor(
    message: string,
    status: number,
    friendlyMessage: string = message,
  ) {
    super(message);
    this.friendlyMessage = friendlyMessage;
    this.statusCode = status;
  }
}
