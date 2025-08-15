// src/channels/types.ts
import { ComponentType } from "react";

export type TemplateKey =
  | "yt_script"
  | "insta_post"
  | "insta_reel"
  | "linkedin"
  | "x_post"
  | "blog"
  | "reddit";

export type ChannelFormProps<V extends Record<string, any> = any> = {
  onCancel: () => void;
  onGenerate: (
    values: V,
    options?: { deepResearch?: boolean }
  ) => void | Promise<void>;
};

export type ChannelMeta<V extends Record<string, any> = any> = {
  key: TemplateKey;
  label: string;
  hint: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  Form: ComponentType<ChannelFormProps<V>>;
  buildTitle?: (values: V) => string;
  buildPrompt: (values: V, options?: { deepResearch?: boolean }) => string;
};
