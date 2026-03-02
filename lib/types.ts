export type MemberProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  what_building: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
};

export type Project = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  url: string | null;
  created_at: string;
};

export type MemberWithProjects = MemberProfile & {
  projects: Pick<Project, "name" | "url">[];
};
