/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 * @typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */

import sharp from 'sharp';
import {
  convertImgToLarge,
  convertImgToSmall,
  convertStringToBuffer,
} from './utils.js';
import { DateTimeResolver } from 'graphql-scalars';

const mimo = {
  png: 'data:image/png;base64',
  jpg: 'data:image/jpg;base64',
};

const typeDefs = `#graphql
  type Enterprise {
    id: Int!
    title: String
    logo: String
    description: String
    vacancies: [Vacancy]
    photos: [Photo]
    marker: Marker
    contacts: String
  }

  type News {
    id: Int!
    date: DateTime
    title: String
    description: String
    photos: [NewsPhoto]
  }

  type Message {
    content: String
  }

  type Vacancy {
    id: Int!
    vacancy: String
    requirements: String
    docs: String
    salary: String
    authorId: Int
  }

  type Photo {
    id: Int!
    small: String
    large: String
    alt: String
    authorId: Int
  }

  type NewsPhoto {
    id: Int!
    small: String
    large: String
    alt: String
    newsId: Int
  }

  type Marker {
    id: Int!
    value: String
    top: Int
    left: Int
    corner: String
  }

  input EnterpriseCreateInput {
    title: String!
  }

  input EnterpriseUpdateInput {
    id: Int!
    title: String
    logo: String
    description: String
    vacancies: [VacancyInput]
    photos: [PhotoInput]
    marker: MarkerInput
    contacts: String
  }

  input NewsCreateInput {
    date: String
    title: String
    description: String
    photos: [NewsPhotoInput]
  }

  input NewsUpdateInput {
    id: Int!
    date: String
    title: String
    description: String
    photos: [NewsPhotoInput]
  }

  input VacancyInput {
    vacancy: String!
    requirements: String
    docs: String
    salary: String
  }

  input PhotoInput {
    img: String!
    alt: String
  }

  input NewsPhotoInput {
    img: String!
    alt: String
  }

  input MarkerInput {
    value: String
    top: Int
    left: Int
    corner: String
  }

  type Query {
    getAllEnterprises: [Enterprise]
    getEnterprise(id: Int): Enterprise
    getAllNews: [News]
    getNews(id: Int): News
  }
  type Mutation {
    createEnterprise(input: EnterpriseCreateInput): Message
    updateEnterprise(input: EnterpriseUpdateInput): Message
    deleteEnterprise(id: Int!): Message
    deletePhotos(id: [Int]): Message
    createNews(input: NewsCreateInput): Message
    updateNews(input: NewsUpdateInput): Message
    deleteNews(id: Int!): Message
    deleteNewsPhotos(id: [Int]): Message
  }

  scalar DateTime
  scalar Upload
`;

const resolvers = {
  Query: {
    /**
     * @param {any} _parent
     * @param {any} _args
     * @param {{ prisma: Prisma }} context
     */
    getAllEnterprises: (_parent, _args, context) => {
      return context.prisma.enterprise.findMany({
        include: {
          vacancies: true,
          marker: true,
          photos: true,
        },
      });
    },
    /**
     *
     * @param {any} _parent
     * @param {{id: number}} args
     * @param {{ prisma: Prisma }} context
     * @returns
     */
    getEnterprise: (_parent, args, context) => {
      return context.prisma.enterprise.findUnique({
        where: { id: args.id || undefined },
        include: {
          vacancies: true,
          marker: true,
          photos: true,
        },
      });
    },
    /**
     * @param {any} _parent
     * @param {any} _args
     * @param {{ prisma: Prisma }} context
     */
    getAllNews: (_parent, _args, context) => {
      return context.prisma.news.findMany({
        include: {
          photos: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    },
    /**
     *
     * @param {any} _parent
     * @param {{id: number}} args
     * @param {{ prisma: Prisma }} context
     * @returns
     */
    getNews: (_parent, args, context) => {
      return context.prisma.news.findUnique({
        where: { id: args.id || undefined },
        include: {
          photos: true,
        },
      });
    },
  },
  Mutation: {
    /**
     * @param { any } _parent
     * @param {{ input: { title: string }}} args
     * @param {{ prisma: Prisma }} context
     */
    createEnterprise: async (_parent, args, context) => {
      try {
        await context.prisma.enterprise.create({
          data: {
            title: args.input.title,
            marker: {
              create: {
                value: args.input.title,
                top: 1000,
                left: 1000,
                corner: 'top-left',
              },
            },
          },
        });

        return { content: 'Предприятие создано' };
      } catch (err) {
        console.error(err);
        return { content: 'Ошибка при создании предприятия' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ input: { id: number, title?: string, logo?: string, contacts?: string, description?: string, vacancies?: { vacancy: string, requirements?: string, docs?: string, salary?: string }[], photos?: { img: string, alt?: string }[], marker?: { value?: string, top: number, left: number, corner?: string }}}} args
     * @param {{ prisma: Prisma }} context
     */
    updateEnterprise: async (_parent, args, context) => {
      let logoResized;
      let photosData = [];

      const {
        id,
        title,
        logo,
        description,
        vacancies,
        photos,
        marker,
        contacts,
      } = args.input;

      try {
        if (logo) {
          const logoImg = convertStringToBuffer(logo);
          const { data } = await sharp(logoImg)
            .resize(null, 200)
            .png()
            .toBuffer({ resolveWithObject: true });
          logoResized = [mimo.png, data.toString('base64')].join(',');
        }

        if (vacancies) {
          await context.prisma.vacancy.deleteMany({
            where: { authorId: id },
          });
        }

        const vacanciesData = vacancies
          ? vacancies.map((vacancy) => {
              return {
                vacancy: vacancy.vacancy,
                requirements: vacancy.requirements || undefined,
                docs: vacancy.docs || undefined,
                salary: vacancy.salary || undefined,
              };
            })
          : [];

        if (photos) {
          for (let i = 0; i < photos.length; i += 1) {
            const smallPhoto = await convertImgToSmall(photos[i].img);
            const largePhoto = await convertImgToLarge(photos[i].img);
            const result = {
              small: smallPhoto,
              large: largePhoto,
              alt: photos[i].alt || undefined,
            };
            photosData.push(result);
          }
          // console.log(photosData);
        }
        // console.log(photosData);
        if (marker) {
          await context.prisma.marker.upsert({
            where: { id: id },
            update: marker,
            create: {
              ...marker,
              author: { connect: { id } },
            },
          });
        }

        await context.prisma.enterprise.update({
          where: { id: id || undefined },
          data: {
            title: title,
            logo: logoResized,
            description: description,
            contacts: contacts,
            vacancies: {
              create: vacanciesData,
            },
            photos: {
              create: photosData,
            },
          },
        });
        return { content: 'Данные сохранены' };
      } catch (error) {
        console.error(error);
        return { content: 'Ошибка при сохранении данных' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ id: number }} args
     * @param {{ prisma: Prisma }} context
     */
    deleteEnterprise: async (_parent, args, context) => {
      try {
        await context.prisma.vacancy.deleteMany({
          where: { authorId: args.id },
        });
        await context.prisma.marker.deleteMany({
          where: { id: args.id },
        });
        await context.prisma.photo.deleteMany({
          where: { authorId: args.id },
        });
        await context.prisma.enterprise.deleteMany({
          where: { id: args.id },
        });
        return { content: 'Предприятие удалено' };
      } catch (err) {
        console.error(err);
        return { content: 'Ошибка при удалении предприятия' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ id: number[] }} args
     * @param {{ prisma: Prisma }} context
     */
    deletePhotos: async (_parent, args, context) => {
      try {
        await context.prisma.photo.deleteMany({
          where: { id: { in: args.id } },
        });
        return { content: 'Фотографии удалены' };
      } catch (err) {
        console.error(err);
        return { content: 'Ошибка при удалении фотографий' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ input: { title: string, date?: string, description?: string, photos?: { img: string, alt?: string }[]}}} args
     * @param {{ prisma: Prisma }} context
     */
    createNews: async (_parent, args, context) => {
      let photosData = [];
      try {
        const { photos } = args.input;
        if (photos) {
          for (let i = 0; i < photos.length; i += 1) {
            const smallPhoto = await convertImgToSmall(photos[i].img);
            const largePhoto = await convertImgToLarge(photos[i].img);
            const result = {
              small: smallPhoto,
              large: largePhoto,
              alt: photos[i].alt || undefined,
            };
            photosData.push(result);
          }
        }

        await context.prisma.news.create({
          data: {
            title: args.input.title,
            date: args.input.date || undefined,
            description: args.input.description,
            photos: {
              create: photosData,
            },
          },
        });

        return { content: 'Новость создана' };
      } catch (err) {
        console.error(err);
        return { content: 'Ошибка при создании новости' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ input: { id: number, title?: string, date?: Date, description?: string, photos?: { img: string, alt?: string }[]}}} args
     * @param {{ prisma: Prisma }} context
     */
    updateNews: async (_parent, args, context) => {
      let photosData = [];

      try {
        const { id, photos } = args.input;
        if (photos) {
          for (let i = 0; i < photos.length; i += 1) {
            const smallPhoto = await convertImgToSmall(photos[i].img);
            const largePhoto = await convertImgToLarge(photos[i].img);
            const result = {
              small: smallPhoto,
              large: largePhoto,
              alt: photos[i].alt || undefined,
            };
            photosData.push(result);
          }
        }

        await context.prisma.news.update({
          where: { id: id || undefined },
          data: {
            title: args.input.title || undefined,
            date: args.input.date || undefined,
            description: args.input.description || undefined,
            photos: {
              create: photosData,
            },
          },
        });
        return { content: 'Данные сохранены' };
      } catch (error) {
        console.error(error);
        return { content: 'Ошибка при сохранении данных' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ id: number }} args
     * @param {{ prisma: Prisma }} context
     */
    deleteNews: async (_parent, args, context) => {
      try {
        await context.prisma.NewsPhoto.deleteMany({
          where: { newsId: args.id },
        });
        await context.prisma.news.deleteMany({
          where: { id: args.id },
        });
        return { content: 'Новость удалена' };
      } catch (err) {
        console.error(err);
        return { content: 'Ошибка при удалении новости' };
      }
    },
    /**
     * @param { any } _parent
     * @param {{ id: number[] }} args
     * @param {{ prisma: Prisma }} context
     */
    deleteNewsPhotos: async (_parent, args, context) => {
      try {
        await context.prisma.NewsPhoto.deleteMany({
          where: { id: { in: args.id } },
        });
        return { content: 'Фотография удалена' };
      } catch (err) {
        console.error(err);
        return { content: 'Ошибка при удалении фотографии' };
      }
    },
  },
  Enterprise: {
    /**
     * @param {{ id: number }} parent
     * @param {any} args
     * @param {{ prisma: Prisma }} ctx
     */
    vacancies: (parent, args, ctx) => {
      return ctx.prisma.enterprise
        .findUnique({
          where: { id: parent.id },
        })
        .vacancies();
    },
    photos: (parent, args, ctx) => {
      return ctx.prisma.enterprise
        .findUnique({
          where: { id: parent.id },
        })
        .photos();
    },
    marker: (parent, args, ctx) => {
      return ctx.prisma.enterprise
        .findUnique({
          where: { id: parent.id },
        })
        .marker();
    },
  },
  News: {
    /**
     * @param {{ id: number }} parent
     * @param {any} args
     * @param {{ prisma: Prisma }} ctx
     */
    photos: (parent, args, ctx) => {
      return ctx.prisma.news
        .findUnique({
          where: { id: parent.id },
        })
        .photos();
    },
  },
  DateTime: DateTimeResolver,
};

const schema = {
  resolvers,
  typeDefs,
};

export default schema;
