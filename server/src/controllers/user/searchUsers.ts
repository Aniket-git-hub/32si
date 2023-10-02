import { Request, Response, NextFunction } from 'express';
import USER from '../../models/user';

async function searchUsers(req: Request, res: Response, next: NextFunction) {
  let searchQuery = req.query.q as string; // Ensure searchQuery is of type string
  try {
    const users = await USER.find({ $text: { $search: searchQuery } });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

export default searchUsers;
