type JWTHeader = {
  alg: string;
  typ: string;
  kid: string;
};

export class Token {
  private _header: JWTHeader;

  private _body: Record<string, any>;

  private _signature: Buffer;

  private _signed: string;

  public constructor(public readonly token: string) {
    const parts = this.token.split('.');

    this._header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    this._body = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    this._signature = Buffer.from(parts[2], 'base64');
    this._signed = parts[0] + '.' + parts[1];
  }

  public get isExpired(): boolean {
    return this._body.exp * 1000 < Date.now();
  }

  public get realm(): string {
    return this._body.iss.split('/').pop();
  }

  public get headers(): JWTHeader {
    return this._header;
  }

  public get body(): Record<string, any> {
    return this._body;
  }

  public get signature(): Buffer {
    return this._signature;
  }

  public get signed(): string {
    return this._signed;
  }
}
