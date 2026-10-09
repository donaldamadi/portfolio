export type Link = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

export type Role = {
  readonly id: string;
  readonly company: string;
  readonly product?: string;
  readonly title: string;
  readonly employment: "Full-time" | "Contract" | "Internship" | "Volunteer";
  readonly location: string;
  readonly start: string;
  readonly end: string;
  readonly current?: boolean;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
};

/**
 * A decision is the unit that actually signals seniority: the call that was
 * made, and, just as importantly, the credible option that was rejected.
 */
export type Decision = {
  readonly title: string;
  readonly body: string;
  readonly rejected: string;
};

export type CaseStudy = {
  readonly slug: string;
  readonly title: string;
  readonly kicker: string;
  readonly company: string;
  readonly period: string;
  readonly role: string;
  readonly summary: string;
  readonly problem: readonly string[];
  readonly constraints: readonly string[];
  readonly decisions: readonly Decision[];
  readonly outcome: readonly string[];
  readonly stack: readonly string[];
  readonly accentIndex: 0 | 1 | 2 | 3;
};

export type Package = {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly language: string;
  readonly license: string;
  readonly since: string;
  readonly links: readonly Link[];
};

export type Project = {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly period: string;
  readonly stack: readonly string[];
  readonly links?: readonly Link[];
};

export type Article = {
  readonly title: string;
  readonly blurb: string;
  readonly date: string;
  readonly publication: string;
  readonly href: string;
};
