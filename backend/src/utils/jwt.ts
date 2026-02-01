import jwt, { SignOptions } from 'jsonwebtoken';

import { StringValue } from "ms";

export type AccessPayload = {
  userId: string;
};

type TokenResult = {
  token: string;
  expiresAt?: number;
};

const DEFAULT_OPTIONS: SignOptions = {
  audience: 'user', // add audience feild as user can be override if we add admin later on
};

export const signJwtToken = (
  payload: AccessPayload,
  options?: SignOptions
): TokenResult => {
  const expiresIn = options?.expiresIn ?? (process.env.JWT_EXPIRES_IN || '1d') as StringValue;

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secert_jwt', {
    ...DEFAULT_OPTIONS,
    expiresIn,
    ...options,
  });

  // optional: compute expiry timestamp only if expiresIn is a string
  let expiresAt: number | undefined;

  if (typeof expiresIn === 'string') {
    const match = expiresIn.match(/^(\d+)([smhdwy])$/);

    if (match) {
      const value = Number(match[1]);
      const unit = match[2];

      const multipliers: Record<string, number> = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
        w: 1000 * 60 * 60 * 24 * 7,
        y: 1000 * 60 * 60 * 24 * 365,
      };

      expiresAt = Date.now() + value * multipliers[unit];
    }
  }

  return {
    token,
    expiresAt,
  };
};
