import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * GraphQL Codegen configuration.
 * Generates TypeScript types from Rick and Morty GraphQL API schema.
 */
const config: CodegenConfig = {
  schema: "https://rickandmortyapi.com/graphql",
  documents: ["lib/graphql/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./lib/graphql/__generated__/": {
      preset: "client",
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
  },
};

export default config;
