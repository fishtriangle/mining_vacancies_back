import { loadEnterprise, saveEnterprise } from '../filesInteraction.js';

const updateEnterprise = (input) => {
  console.log('updateEnterprise', input.vacancies);
  const vacancies = input.vacancies.map((vacancy, index) => ({
    ...vacancy,
    id: index + 1,
  }));

  return {
    ...input,
    vacancies,
  };
};

const root = {
  getEnterprise: ({ id }) => {
    return loadEnterprise(id);
  },
  updateEnterprise: ({ input }) => {
    const enterprise = updateEnterprise(input);
    const resultMessage = { content: saveEnterprise(enterprise) };
    return resultMessage;
  },
};

export default root;
