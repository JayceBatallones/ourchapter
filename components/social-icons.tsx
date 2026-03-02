import { Globe, Github, Twitter } from "lucide-react";

type SocialLinkProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

type SocialLinksProps = {
  website?: string | null;
  twitter?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
};

export function SocialLinks({
  website,
  twitter,
  github,
  linkedin,
  instagram,
  youtube,
  tiktok,
}: SocialLinksProps) {
  const links: { href: string; label: string; icon: React.ReactNode }[] = [];

  if (website)
    links.push({
      href: website.startsWith("http") ? website : `https://${website}`,
      label: "Website",
      icon: <Globe size={16} />,
    });
  if (twitter)
    links.push({
      href: `https://x.com/${twitter}`,
      label: "Twitter",
      icon: <Twitter size={16} />,
    });
  if (github)
    links.push({
      href: `https://github.com/${github}`,
      label: "GitHub",
      icon: <Github size={16} />,
    });
  if (linkedin)
    links.push({
      href: `https://linkedin.com/in/${linkedin}`,
      label: "LinkedIn",
      icon: <LinkedInIcon size={16} />,
    });
  if (instagram)
    links.push({
      href: `https://instagram.com/${instagram}`,
      label: "Instagram",
      icon: <InstagramIcon size={16} />,
    });
  if (youtube)
    links.push({
      href: `https://youtube.com/@${youtube}`,
      label: "YouTube",
      icon: <YouTubeIcon size={16} />,
    });
  if (tiktok)
    links.push({
      href: `https://tiktok.com/@${tiktok}`,
      label: "TikTok",
      icon: <TikTokIcon size={16} />,
    });

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <SocialLink key={link.label} href={link.href} label={link.label}>
          {link.icon}
        </SocialLink>
      ))}
    </div>
  );
}
