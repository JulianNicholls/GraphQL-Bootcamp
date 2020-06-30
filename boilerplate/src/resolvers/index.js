import { extractFragmentReplacements } from 'prisma-binding';

import Query from './Query';
import Mutation from './Mutation';
// import Subscription from './Subscription';
import User from './User';

export const resolvers = {
  Query,
  Mutation,
  // Subscription,
  User,
};

export const fragmentReplacements = extractFragmentReplacements(resolvers);
