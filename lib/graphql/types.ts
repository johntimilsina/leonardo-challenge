/**
 * TypeScript types for Rick and Morty GraphQL API responses.
 * @see https://rickandmortyapi.com/documentation/#graphql
 */

/** Character's origin or current location */
export interface Location {
  id: string;
  name: string;
  type: string;
  dimension: string;
}

/** Episode information */
export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}

/** Character entity from the API */
export interface Character {
  id: string;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: Pick<Location, "name">;
  location: Pick<Location, "name">;
  image: string;
  episode: Pick<Episode, "id" | "name">[];
  created: string;
}

/** Pagination info returned by the API */
export interface PaginationInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

/** Response shape for characters query */
export interface CharactersResponse {
  characters: {
    info: PaginationInfo;
    results: Character[];
  };
}

/** Response shape for single character query */
export interface CharacterResponse {
  character: Character;
}
