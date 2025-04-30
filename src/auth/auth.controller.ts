import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignUpSchema } from './dto/auth.dto';
import { sendResponse } from 'src/common/utils/send-response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: unknown, @Res() res: Response) {
    const parsed = SignUpSchema.safeParse(body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const result = await this.authService.signUp(parsed.data);
    sendResponse(res, {
      statusCode: 201,
      message: 'User registered successfully',
      data: result,
    });
  }

  @Post('signin')
  async signIn(@Body() body: unknown, @Req() req: Request, @Res() res: Response) {
    const parsed = SignInSchema.safeParse(body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const { accessToken, refreshToken, user } = await this.authService.signIn(parsed.data);

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse(res, {
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        accessToken,
        user,
      },
    });
  }
}
