import { MigrationInterface, QueryRunner } from "typeorm"

export class RootEntityMigration1603645267289 implements MigrationInterface {
  name = "RootEntityMigration1603645267289"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`)
    await queryRunner.query(`ALTER TABLE "todo" ADD "updateAt" TIMESTAMP NOT NULL DEFAULT now()`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "updateAt"`)
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "createdAt"`)
  }
}
