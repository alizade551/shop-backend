import { JwtModuleOptions } from '@nestjs/jwt';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const config: JwtModuleOptions = {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_TTL,
    },
  };

  return config;
});
