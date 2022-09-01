import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Enterprise {
    id: ID!
    title: String
    vacancies: [Vacancy]
  }
  type Message {
    content: String
  }
  type Vacancy {
    id: ID
    vacancy: String
    requirements: String
    docs: String
  }
  
  input EnterpriseInput {
    id: ID!
    title: String
    vacancies: [VacancyInput]
  }
  input VacancyInput {
    id: ID
    vacancy: String!
    requirements: String
    docs: String
  }
  
  type Query {
    getAllEnterprises: [Enterprise]
    getEnterprise(id: ID): Enterprise
  }
  type Mutation {
    updateEnterprise(input: EnterpriseInput): Message
  }
`);

export default schema;
