import fs from "fs";
import handlebars from "handlebars";

export function parseHandlebarsFile(
  htmlTemplatePath: string,
  variables?: { [key: string]: string | number | boolean }
): string {
  const templateFileContent = fs
    .readFileSync(htmlTemplatePath)
    .toString("utf-8");

  const templateParse = handlebars.compile(templateFileContent);

  const templateHTML = templateParse(variables);

  return templateHTML;
}
