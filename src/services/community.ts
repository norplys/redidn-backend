import type { ValidCreateCommunitySchema } from '../middlewares/validation/communities.js';
import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';

async function getAllCommunities() {
  const communities = await prisma.community.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      icon: true
    }
  });

  return communities;
}

async function getAndCheckUserAccessToCommunity(
  userId: string | undefined,
  communityId: string
) {
  let role;
  const community = await prisma.community.findUnique({
    where: {
      id: communityId
    }
  });

  if (!community) {
    throw new HttpError('Community not found', 404);
  }

  if (community.type === 'PRIVATE') {

    if (!userId) {
      throw new HttpError('Missing user id', 401);
    }

    const member = await prisma.member.findFirst({
      where: {
        userId,
        communityId
      }
    });

    if (!member) {
      throw new HttpError('You are not a member of this community', 403);
    }

    role = member.role;
  }

  return {
    community,
    role
  };
}

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

async function getCommunityById(id: string) {
  const community = await prisma.community.findUnique({
    where: {
      id
    }
  });

  if (!community) {
    throw new HttpError('Community not found', 404);
  }

  return community;
}

async function createCommunity(
  payload: ValidCreateCommunitySchema,
  userId: string
) {
  const { topics, ...rest } = payload;

  const topicsArray =
    topics?.map((topic) => {
      return {
        where: {
          name: topic
        },
        create: {
          name: topic
        }
      };
    }) || [];

  await prisma.community.create({
    data: {
      ...rest,
      userId,
      topics: {
        connectOrCreate: topicsArray
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
  blockIfCommunityNameExists,
  getCommunityById,
  getAndCheckUserAccessToCommunity,
  getAllCommunities
};
