import React from "react";
import s from "./TemplateCard.module.css";

type Props = {
  title: string;
  desc: string;
  gradient:
    | "launch"
    | "weekly"
    | "founder"
    | "sale"
    | "howto"
    | "trend";
  icon: "rocket" | "bar" | "user" | "tag" | "wrench" | "trend";
  tags: string[];
};

const Icon = ({ name }: { name: Props["icon"] }) => {
  switch (name) {
    case "rocket":
      return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2"><path d="M5 15l4 4m10-10l-6 6M14 10l6-6"/><path d="M12 16c-1.5 0-3 .5-4 1.5"/></svg>;
    case "bar":
      return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2"><path d="M4 20h16M6 16v-4M10 20V8M14 20v-6M18 20v-10"/></svg>;
    case "user":
      return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="8" r="3"/><path d="M4 20a8 8 0 0116 0"/></svg>;
    case "tag":
      return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 6h7l5 5-7 7-5-5z"/><circle cx="9" cy="9" r="1.2"/></svg>;
    case "wrench":
      return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 7a4 4 0 005.65-1.65L16 8l-8 8-3.5-3.5 8-8 2.65 3.15z"/><path d="M16 16l-2 2"/></svg>;
    case "trend":
      return <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 20h18"/><path d="M4 14l5-5 4 4 6-6"/></svg>;
  }
};

export default function TemplateCard({ title, desc, gradient, icon, tags }: Props) {
  return (
    <article className={`${s.card} ${s[`grad_${gradient}`]}`}>
      <div className={s.media}>
        <Icon name={icon} />
      </div>
      <div className={s.body}>
        <h3 className={s.title}>{title}</h3>
        <p className={s.desc}>{desc}</p>
        <div className={s.tags}>
          {tags.map((t) => (
            <span key={t} className={s.tag}>{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
