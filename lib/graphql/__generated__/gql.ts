/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetCharacters($page: Int!) {\n        characters(page: $page) {\n            info {\n                count\n                pages\n                next\n                prev\n            }\n            results {\n                id\n                name\n                status\n                species\n                type\n                gender\n                origin {\n                    name\n                }\n                location {\n                    name\n                }\n                image\n            }\n        }\n    }\n": typeof types.GetCharactersDocument,
    "\n    query GetCharacter($id: ID!) {\n        character(id: $id) {\n            id\n            name\n            status\n            species\n            type\n            gender\n            origin {\n                name\n            }\n            location {\n                name\n            }\n            image\n            episode {\n                id\n                name\n                episode\n            }\n            created\n        }\n    }\n": typeof types.GetCharacterDocument,
};
const documents: Documents = {
    "\n    query GetCharacters($page: Int!) {\n        characters(page: $page) {\n            info {\n                count\n                pages\n                next\n                prev\n            }\n            results {\n                id\n                name\n                status\n                species\n                type\n                gender\n                origin {\n                    name\n                }\n                location {\n                    name\n                }\n                image\n            }\n        }\n    }\n": types.GetCharactersDocument,
    "\n    query GetCharacter($id: ID!) {\n        character(id: $id) {\n            id\n            name\n            status\n            species\n            type\n            gender\n            origin {\n                name\n            }\n            location {\n                name\n            }\n            image\n            episode {\n                id\n                name\n                episode\n            }\n            created\n        }\n    }\n": types.GetCharacterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCharacters($page: Int!) {\n        characters(page: $page) {\n            info {\n                count\n                pages\n                next\n                prev\n            }\n            results {\n                id\n                name\n                status\n                species\n                type\n                gender\n                origin {\n                    name\n                }\n                location {\n                    name\n                }\n                image\n            }\n        }\n    }\n"): typeof import('./graphql').GetCharactersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCharacter($id: ID!) {\n        character(id: $id) {\n            id\n            name\n            status\n            species\n            type\n            gender\n            origin {\n                name\n            }\n            location {\n                name\n            }\n            image\n            episode {\n                id\n                name\n                episode\n            }\n            created\n        }\n    }\n"): typeof import('./graphql').GetCharacterDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
