import DynamicIcon from "./DynamicIcon";
import { getSiteLink, isExternalLink } from "../data/SiteConfig";

export default function DynamicCta({ cta, onNavigate, className = "" }) {
  const variantClass = cta.variant === "primary" ? "pixel-button-primary" : "";
  const classes = `pixel-button ${variantClass} ${className}`.trim();

  if (cta.type === "page") {
    return (
      <button type="button" onClick={() => onNavigate(cta.target)} className={classes}>
        {cta.label}
        {cta.arrow ? <span aria-hidden="true">→</span> : null}
      </button>
    );
  }

  const link = getSiteLink(cta.linkKey);

  if (!link) {
    return null;
  }

  const content = (
    <>
      <DynamicIcon name={link.icon} className="text-xl" />
      {cta.label || link.label}
      {cta.arrow ? <span aria-hidden="true">→</span> : null}
    </>
  );

  return isExternalLink(link.href) ? (
    <a href={link.href} target="_blank" rel="noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <a href={link.href} className={classes}>
      {content}
    </a>
  );
}
