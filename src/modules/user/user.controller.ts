import { Body, Controller, Get, Inject, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiModelProperty, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Model, Schema } from 'mongoose';
import * as rp from 'request-promise-native';
import * as bcrypt from 'bcrypt';
import * as jwtSimple from 'jwt-simple';
import { environment } from '../../environment';

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(plaintextPassword: string, hash: string) {
  return bcrypt.compare(plaintextPassword, hash);
}

export class LoginData {
  @ApiModelProperty()
  readonly username: string;

  @ApiModelProperty()
  readonly password: string;
}

@ApiUseTags('user')
@Controller('user')
export class UserController {

  constructor(
    @Inject('EntryModelToken') private readonly entryModel: Model<any>) {
    // this.create();
  }

  async create() {
    const x = new this.entryModel({ username: 'user', password: await hashPassword('....') });
    x.save();
  }

  @Post('/login')
  @ApiResponse({ status: 200, description: `Returns token`})
  async login(@Body() loginData: LoginData) {
    const user = await this.entryModel.findOne({ username: loginData.username }).lean();
    if (!user || !(await comparePassword(loginData.password, (user as any).password))) {
      throw new UnauthorizedException();
    }

    return { ...user, password: void 0 };
  }

  @Get('/token-valid/:token')
  @ApiResponse({ status: 200, description: `Validates token and return user object`})
  async validate(@Param() params): Promise<any> {
    const rawToken = params.token;
    if (!rawToken) {
      throw new UnauthorizedException();
    }
    let token;
    try {
      token = jwtSimple.decode(rawToken, environment.jwtSecret);
    } catch (e) {
      throw new UnauthorizedException();
    }
    if (token.exp <= Date.now()) {
      throw new UnauthorizedException();
    }
    const user = await this.entryModel.findById(token.id).lean();
    return user;
  }
}
