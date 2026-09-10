import {timingSafeEqual} from "node:crypto"

/**
 * Compare a caller supplied secret against a configured one in constant time.
 *
 * Fails closed when the expected secret is missing from the environment. A plain
 * `!==` comparison against an unset variable resolves to the string "undefined",
 * which lets a caller authenticate by guessing that literal value.
 */
export const secretMatches = (
  provided: string | null | undefined,
  expected: string | undefined
): provided is string => {
  if (!provided || !expected) return false

  const providedBytes = Buffer.from(provided)
  const expectedBytes = Buffer.from(expected)

  // timingSafeEqual throws on length mismatch, so the lengths are compared first.
  if (providedBytes.length !== expectedBytes.length) return false
  return timingSafeEqual(providedBytes, expectedBytes)
}

/**
 * Compare a bearer token header against a configured secret.
 */
export const bearerMatches = (authHeader: string | null, expected: string | undefined): boolean => {
  if (!authHeader?.startsWith("Bearer ")) return false
  return secretMatches(authHeader.slice("Bearer ".length), expected)
}

/**
 * Decode a basic auth header without throwing on malformed input.
 */
export const parseBasicAuth = (authHeader: string | null): {user: string; pass: string} | undefined => {
  const [scheme, encoded] = authHeader?.split(" ") || []
  if (scheme?.toLowerCase() !== "basic" || !encoded) return

  const [user, ...passParts] = Buffer.from(encoded, "base64").toString().split(":")
  // Passwords may contain colons, so only the first separator is significant.
  return {user, pass: passParts.join(":")}
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Drupal entity uuids are RFC 4122 formatted. Validating the shape before a
 * lookup keeps unbounded ids from creating a cache entry and a Drupal query
 * each.
 */
export const isUuid = (value: string | undefined): boolean => !!value && UUID_PATTERN.test(value)
