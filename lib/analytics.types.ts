import type { EVENTS } from "@/constants/events";

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// Vercel Analytics only accepts primitives as property values.
export type VercelEventProperties = Record<
  string,
  string | number | boolean | null
>;

/** Parameter shapes for each analytics event. Must have an entry for every EVENTS value. */
export interface EventParamsMap {
  section_view: {
    section_id: string;
    section_title?: string;
    locale: string;
  };
  scroll_depth: {
    depth_percent: 25 | 50 | 75 | 100;
  };
  page_complete: {
    time_on_page_seconds?: number;
    locale: string;
  };
  cta_click: {
    cta_label: string;
    destination_url: string;
    section_id?: string;
  };
  external_link_click: {
    url: string;
    link_text: string;
    section_id?: string;
  };
  language_switch: {
    from_locale: string;
    to_locale: string;
  };
  cookie_consent_accepted: Record<string, never>;
  cookie_consent_declined: Record<string, never>;
  cookie_consent_revoked: Record<string, never>;
}

export type EventParams<T extends EventName> = T extends keyof EventParamsMap
  ? EventParamsMap[T]
  : Record<string, unknown>;
