/** Branded string types for URL and version validation at the type level.
 *  HttpPath enforces "http(s)://" prefix, FilePath enforces "/" or "./" prefix.
 *  AppVersion uses semver template literal pattern. */
export type HttpPath = `http${string}://${string}`;

export type FilePath = `/${string}` | `./${string}`;

export type AppVersion = `${number}.${number}.${number}`;

export type WindowResolution = `${number}x${number}`;
