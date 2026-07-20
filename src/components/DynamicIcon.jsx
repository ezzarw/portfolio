import { AiOutlineGithub } from "@react-icons/all-files/ai/AiOutlineGithub";
import { GrLinkedinOption } from "@react-icons/all-files/gr/GrLinkedinOption";
import { MdEmail } from "@react-icons/all-files/md/MdEmail";

const icons = {
  email: MdEmail,
  github: AiOutlineGithub,
  linkedin: GrLinkedinOption,
};

export default function DynamicIcon({ name, className = "" }) {
  const Icon = icons[name];

  return Icon ? <Icon className={className} aria-hidden="true" /> : null;
}
