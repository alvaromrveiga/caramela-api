import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointments1636388316845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "appointments",
        columns: [
          { name: "id", type: "uuid", isPrimary: true },
          { name: "pet_id", type: "uuid" },
          { name: "veterinary", type: "varchar" },
          { name: "motive", type: "varchar" },
          { name: "weight_kg", type: "decimal", isNullable: true },
          { name: "vaccines", type: "varchar", isNullable: true },
          { name: "comments", type: "varchar", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            name: "FKPet",
            referencedTableName: "pets",
            referencedColumnNames: ["id"],
            columnNames: ["pet_id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("appointments");
  }
}
