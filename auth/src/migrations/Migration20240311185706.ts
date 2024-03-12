import { Migration } from '@mikro-orm/migrations';

export class Migration20240311185706 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("uuid" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" text check ("role" in (\'admin\', \'moderator\', \'user\')) not null, constraint "user_pkey" primary key ("uuid"));');
    this.addSql('alter table "user" add constraint "user_name_unique" unique ("name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
