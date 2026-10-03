import { notFound } from "next/navigation";
import MemberProfile from "@/sections/team/Profile/MemberProfile";
import { team, getMember } from "@/sections/team/teamData";

export const dynamicParams = false;

export function generateStaticParams() {
  return team.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }) {
  const member = getMember(params.slug);
  return member ? { title: member.name, description: member.shortBio } : {};
}

export default function TeamMemberPage({ params }) {
  const member = getMember(params.slug);
  if (!member) notFound();
  return <MemberProfile member={member} />;
}
