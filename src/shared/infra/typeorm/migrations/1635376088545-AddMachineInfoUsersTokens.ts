import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMachineInfoUsersTokens1635376088545
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users_tokens",
      new TableColumn({
        name: "machine_info",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users_tokens", "machine_info");
  }
}
