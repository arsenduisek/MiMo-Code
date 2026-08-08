declare global {
  const NEXUSCODE_VERSION: string
  const NEXUSCODE_CHANNEL: string
}

export const InstallationVersion = typeof NEXUSCODE_VERSION === "string" ? NEXUSCODE_VERSION : "local"
export const InstallationChannel = typeof NEXUSCODE_CHANNEL === "string" ? NEXUSCODE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
