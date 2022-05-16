export default class UserData {
  private readonly sub: string;
  readonly userId: string;
  readonly email: string;
  readonly nickname: string;

  constructor(sub: string, email: string, nickname: string) {
    this.sub = sub;
    this.userId = this.sub.replace('|', '-');
    this.email = email;
    this.nickname = nickname;
  }
}
