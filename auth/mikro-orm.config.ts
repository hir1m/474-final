import { defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { Migrator } from "@mikro-orm/migrations";

// no need to specify the `driver` now, it will be inferred automatically
export default defineConfig({
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
  },
  dbName: process.env.DB_NAME || "auth",
  clientUrl:
    process.env.POSTGRES_URL ||
    "postgres://auth:pgpassword@127.0.0.1:5432/auth",
  // folder-based discovery setup, using common filename suffix
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
  extensions: [EntityGenerator, Migrator],
});
