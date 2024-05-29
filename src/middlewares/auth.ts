import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";

const authenticate = (
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<any> | void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new BadRequestException(
      "Token não informado",
      ErrorCode.UNAUTHORIZED
    );
  }

  const [, token] = authHeader.split(" ");

  try {
    verify(token, String(process.env.APP_SECRET));

    next();
  } catch {
    throw new BadRequestException("Token inválido", ErrorCode.UNAUTHORIZED);
  }
};

export default authenticate;
