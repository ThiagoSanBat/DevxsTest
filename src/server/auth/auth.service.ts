import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException, UserNotVerifiedException } from '../exceptions';
import { UsersService } from '../users/users.service';
import { LoggedUser } from './dto/logged-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    return await this.userService.findByEmailAndPassword(email, password);
  }

  async validateUserByEmail(email: string) {
    return await this.userService.findByEmail(email);
  }

  async login(userLogin: LoginUserDto) {
    const user = await this.validateUser(userLogin.email, userLogin.password);

    if (user) {
      if (user.verified) {
        return this.jwtService.sign({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        });
      }
      throw new UserNotVerifiedException('User not verified');
    }
    throw new UserNotFoundException('Invalid login/password');
  }

  async decode(auth: string) {
    if (auth) {
      const jwt = auth.replace('Bearer ', '');
      const tokenDecoded = this.jwtService.decode(jwt, {
        json: true,
      }) as LoggedUser;
      const loggedUser = new LoggedUser();
      return Object.assign(loggedUser, {
        email: tokenDecoded.email,
        name: tokenDecoded.name,
        id: tokenDecoded.id,
      });
    }
    return null;
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}
