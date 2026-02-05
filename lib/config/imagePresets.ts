// lib/config/imagePresets.ts

export const IMAGE_PRESETS = {
  profile: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.85,
    format: "image/jpeg",
  },

  thumbnail: {
    maxWidth: 600,
    maxHeight: 400,
    quality: 0.8,
    format: "image/jpeg",
  },

  banner: {
    maxWidth: 1600,
    maxHeight: 900,
    quality: 0.8,
    format: "image/jpeg",
  },

  blog: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.85,
    format: "image/jpeg",
  },

  original: {
    maxWidth: 9999,
    maxHeight: 9999,
    quality: 0.92,
    format: "image/jpeg",
  },
} as const;
