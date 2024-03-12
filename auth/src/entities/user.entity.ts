import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { randomUUID } from "crypto";

@Entity()
export class User {
  @PrimaryKey({ type: "uuid" })
  uuid: string = randomUUID();

  @Property()
  @Unique()
  name!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Enum(() => UserRole)
  role!: UserRole;

  constructor(name: string, email: string, password: string, role: UserRole) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.role = role;
  }
}

export enum UserRole {
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
}
