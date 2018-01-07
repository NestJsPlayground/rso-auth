import { Body, Controller, Get, Inject, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiModelProperty, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Model, Schema } from 'mongoose';
import * as rp from 'request-promise-native';
import * as bcrypt from 'bcrypt';
import * as jwtSimple from 'jwt-simple';
import { environment } from '../../environment';
import * as moment from 'moment';

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

  @Post('login')
  @ApiResponse({ status: 200, description: `Returns token`})
  async login(@Body() loginData: LoginData) {
    const user = await this.entryModel.findOne({ username: loginData.username }).lean();
    if (!user || !(await comparePassword(loginData.password, (user as any).password))) {
      throw new UnauthorizedException();
    }
    const token = jwtSimple.encode({
      id: (user as any)._id,
      exp: moment().add(30, 'days').unix(),
    }, environment.jwtSecret);
    return { ...user, password: void 0, token };
  }

  @Get('token-valid/:token')
  @ApiResponse({ status: 200, description: `Validates token and return user object`})
  async validate(@Param('token') rawToken: string): Promise<any> {
    if (!rawToken) {
      throw new UnauthorizedException();
    }
    let token;
    try {
      token = jwtSimple.decode(rawToken, environment.jwtSecret);
    } catch (e) {
      throw new UnauthorizedException();
    }
    if (token.exp <= moment().unix()) {
      throw new UnauthorizedException();
    }
    const user = await this.entryModel.findById(token.id).lean();
    return user;
  }
}
