import { Request, Response } from 'express';
import { authService, AuthService } from './auth.service';
import { sendSuccess, sendCreated } from '../../common/http/response';
import { SESSION_COOKIE_NAME } from '../../middleware/auth.middleware';
import { env } from '../../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export class AuthController {
  constructor(private service: AuthService = authService) {}

  login = async (req: Request, res: Response) => {
    const result = await this.service.login(req.body);
    res.cookie(SESSION_COOKIE_NAME, result.token, COOKIE_OPTIONS);
    return sendSuccess(res, { user: result.user, token: result.token });
  };

  registerOrganization = async (req: Request, res: Response) => {
    const result = await this.service.registerOrganization(req.body);
    res.cookie(SESSION_COOKIE_NAME, result.token, COOKIE_OPTIONS);
    return sendCreated(res, {
      user: result.user,
      organization: result.organization,
      token: result.token,
    });
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie(SESSION_COOKIE_NAME, {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });
    return sendSuccess(res, { message: 'Logged out successfully' });
  };

  me = async (req: Request, res: Response) => {
    if (!req.user) {
      return sendSuccess(res, { user: null });
    }
    const userProfile = await this.service.getCurrentUser(req.user.id);
    return sendSuccess(res, { user: userProfile });
  };
}

export const authController = new AuthController();

