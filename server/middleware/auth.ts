import { Request, Response, NextFunction } from 'express';

// Extend express-session to include our custom user data
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      displayName: string;
      role: string;        // ADMIN or BRANCH
      branchId?: string;
      branchName?: string;
    };
  }
}

/** Requires the user to be logged in */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }
  next();
}

/** Requires the user to be an ADMIN */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized. Please log in.' });
    return;
  }
  if (req.session.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden. Admin access required.' });
    return;
  }
  next();
}

/**
 * Get the branchId scope for queries.
 * - Admin: returns the branchId from query param (if any), or undefined (all branches)
 * - Branch user: always returns their own branchId
 */
export function getBranchScope(req: Request): string | undefined {
  const user = req.session.user!;
  if (user.role === 'ADMIN') {
    // Admin can optionally filter by branch
    return (req.query.branchId as string) || undefined;
  }
  // Branch users are always scoped to their branch
  return user.branchId;
}
