import { Request, Response } from "express";
import Community from "../../models/Community";
import User from "../../models/User";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, memberCount } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (category) filter.category = category;
    if (memberCount) {
      const [min, max] = (memberCount as string).split("-").map(Number);
      filter.$expr = { $gte: [{ $size: "$members" }, min] };
      if (max) filter.$expr.$lte = [{ $size: "$members" }, max];
    }

    const [communities, total] = await Promise.all([
      Community.find(filter)
        .populate("members", "firstName lastName email avatar")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Community.countDocuments(filter),
    ]);

    success(res, {
      communities,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    handleError(res, error, "fetch communities");
  }
};

export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("members", "firstName lastName email avatar")
      .populate("posts");

    if (!community) return notFound(res, "Community");
    success(res, community);
  } catch (error) {
    handleError(res, error, "fetch community");
  }
};

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { name, creatorId, ...communityData } = req.body;

    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity)
      return badRequest(res, "Community name already exists");

    const community = await Community.create({
      ...communityData,
      name,
      members: [creatorId],
      posts: [],
    });

    success(res, community, "Community created successfully", 201);
  } catch (error) {
    handleError(res, error, "create community");
  }
};

export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!community) return notFound(res, "Community");
    success(res, community, "Community updated successfully");
  } catch (error) {
    handleError(res, error, "update community");
  }
};

export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return notFound(res, "Community");
    success(res, null, "Community deleted successfully");
  } catch (error) {
    handleError(res, error, "delete community");
  }
};

const manageMembership = async (
  req: Request,
  res: Response,
  action: "join" | "leave"
) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const [community, user] = await Promise.all([
      Community.findById(id),
      User.findById(userId),
    ]);

    if (!community) return notFound(res, "Community");
    if (!user) return notFound(res, "User");

    const isMember = community.members.includes(userId);

    if (action === "join") {
      if (isMember) return badRequest(res, "User is already a member");
      community.members.push(userId);
    } else {
      if (!isMember) return badRequest(res, "User is not a member");
      community.members = community.members.filter(
        (id) => id.toString() !== userId
      );
    }

    await community.save();
    success(
      res,
      null,
      `Successfully ${action === "join" ? "joined" : "left"} community`
    );
  } catch (error) {
    handleError(res, error, `${action} community`);
  }
};

export const joinCommunity = (req: Request, res: Response) =>
  manageMembership(req, res, "join");

export const leaveCommunity = (req: Request, res: Response) =>
  manageMembership(req, res, "leave");
