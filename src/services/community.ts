import type { ValidCreateCommunitySchema } from '../middlewares/validation/communities.js';
import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';

async function blockIfCommunityNameExists(name: string) {
  const community = await prisma.community.findUnique({
    where: {
      name
    }
  });

  if (community) {
    throw new HttpError('Community name already exists', 409);
  }

  return true;
}

async function createCommunity(
  payload: ValidCreateCommunitySchema,
  userId: string
) {
  const { topics, ...rest } = payload;

  await prisma.community.create({
    data: {
      ...rest,
      userId,
      topics: {
        connectOrCreate: topics?.map((topic) => ({
          where: {
            name: topic
          },
          create: {
            name: topic
          }
        }))
      },
      member: {
        create: {
          userId,
          role: 'OWNER'
        }
      }
    }
  });
}

export const communityService = {
  createCommunity,
  blockIfCommunityNameExists
};
