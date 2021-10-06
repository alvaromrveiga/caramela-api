import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPetSpecies1633550001901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "pets",
      new TableColumn({
        name: "species",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("pets", "species");
  }
}
