export {};

type TawkCallback = (error?: unknown) => void;

type TawkPosition = "br" | "bl" | "cr" | "cl" | "tr" | "tl";

type TawkVisibilitySlot = {
  xOffset?: string | number;
  yOffset?: string | number;
  position?: TawkPosition;
};

interface TawkAPI {
  customStyle?: {
    zIndex?: number | string;
    visibility?: {
      desktop?: TawkVisibilitySlot;
      mobile?: TawkVisibilitySlot;
    };
  };
  onLoad?: () => void;
  onChatMaximized?: () => void;
  onChatMinimized?: () => void;
  onChatHidden?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  showWidget?: () => void;
  hideWidget?: () => void;
  shutdown?: () => void;
  setAttributes?: (attrs: Record<string, string>, callback?: TawkCallback) => void;
  addEvent?: (
    name: string,
    data?: Record<string, string>,
    callback?: TawkCallback,
  ) => void;
  addTags?: (tags: string[], callback?: TawkCallback) => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkAPI;
    Tawk_LoadStart?: Date;
  }
}
