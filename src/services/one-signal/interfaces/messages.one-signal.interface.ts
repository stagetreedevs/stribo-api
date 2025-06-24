export interface CreateOneSignalMessage {
  app_id: string;
  contents: { [key: string]: string };
  headings?: { [key: string]: string };
  include_player_ids?: string[];
  include_external_user_ids?: string[];
  url?: string;
  data?: { [key: string]: any };
  buttons?: Array<{ id: string; text: string; icon?: string }>;
  android_channel_id?: string;
  ios_badgeType?: 'Increase' | 'SetTo' | 'None';
  ios_badgeCount?: number;
  web_buttons?: Array<{ id: string; text: string; icon?: string }>;
  send_after?: string;
}

export interface CreateOneSignalMessageResponse {
  id: string;
  external_id: string;
}
