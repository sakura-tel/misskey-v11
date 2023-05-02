import {MigrationInterface, QueryRunner} from "typeorm";

export class deleteLog1683005883304 implements MigrationInterface {
    name = 'deleteLog1683005883304'

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`DROP TABLE "log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`CREATE TABLE "log" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "domain" character varying(64) array NOT NULL DEFAULT '{}'::varchar[], "level" "log_level_enum" NOT NULL, "worker" character varying(8) NOT NULL, "machine" character varying(128) NOT NULL, "message" character varying(1024) NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);

    }

}
