export type MemberProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  what_building: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  status: "pending" | "approved" | "rejected" | null;
};

export type Project = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  url: string | null;
  created_at: string;
};

export type Application = {
  id: string;
  profile_id: string;
  what_building: string | null;
  link_url: string | null;
  contribution: string | null;
  referral_source: string | null;
  created_at: string;
};

export type MemberWithProjects = MemberProfile & {
  projects: Pick<Project, "name" | "url">[];
};
