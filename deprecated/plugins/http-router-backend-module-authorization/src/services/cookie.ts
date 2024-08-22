import { Request, Response } from 'express';

export const setCookieService = (_: Request, res: Response) => {
  res.status(200).send();
};