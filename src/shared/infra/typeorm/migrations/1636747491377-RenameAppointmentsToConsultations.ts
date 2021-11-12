import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAppointmentsToConsultations1636747491377
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("appointments", "consultations");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("consultations", "appointments");
  }
}
