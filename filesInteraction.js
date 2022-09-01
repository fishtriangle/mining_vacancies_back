import { readFile, writeFile } from 'node:fs/promises';
import Path from 'path';

const folderPath = Path.resolve(process.cwd());

export async function saveEnterprise(enterprise) {
  let resultMessage = 'Вакансии успешно сохранены';
  const str = JSON.stringify(enterprise);
  try {
    await writeFile(`${folderPath}/vacancies/${enterprise.id}.json`, str);
  } catch (e) {
    resultMessage = 'Ошибка при попытке сохранить список вакансий';
    console.error(e.message);
  }
  return resultMessage;
}

export async function loadEnterprise(id) {
  let data = '';
  try {
    data = await readFile(`${folderPath}/vacancies/${id}.json`);
  } catch (e) {
    console.error(e.message);
  }
  return JSON.parse(data);
}
