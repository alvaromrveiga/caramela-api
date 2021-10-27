import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveTokensFromUsers1635360628865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "tokens");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "tokens",
        type: "varchar",
        isNullable: true,
        isArray: true,
      })
    );
  }
}
