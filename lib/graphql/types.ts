/**
 * Re-export generated GraphQL types.
 * Types are auto-generated from the Rick and Morty GraphQL schema.
 * Run `pnpm codegen` to regenerate after schema changes.
 */
export type {
  Character,
  Episode,
  Location,
  Info,
  Characters,
  GetCharactersQuery,
  GetCharactersQueryVariables,
  GetCharacterQuery,
  GetCharacterQueryVariables,
} from "./__generated__/graphql";

export {
  GetCharactersDocument,
  GetCharacterDocument,
} from "./__generated__/graphql";
