import { PrismaClient } from '@prisma/client';
import process from 'node:process';

const prisma = new PrismaClient();

const enterpriseData = [
  {
    title: 'АО «КАМЧАТСКОЕ ЗОЛОТО»',
    photos: {
      create: [
        {
          small: 'path/to/file.png',
          large: 'path/to/file.png',
          alt: 'Весна на месторождении',
        },
        {
          small: 'path/to/file.png',
          large: 'path/to/file.png',
          alt: 'Работа под землей',
        },
        {
          small: 'path/to/file.png',
          large: 'path/to/file.png',
          alt: 'Тяжелая техника',
        },
      ],
    },
    logo: 'path/to/file.png',
    marker: {
      create: {
        value: 'Бараньевское',
        top: 67,
        left: 16,
        corner: 'top-left',
      },
    },
    contacts: '+7 (914) 997-65-40 (Екатерина Викторовна Зарезова)',
    vacancies: {
      create: [
        {
          vacancy: 'Грохотовщик',
          requirements:
            'Среднее полное образование; Опыт работы в аналогичной должности от 1 года',
          docs: 'Паспорт (копия); ИНН, СНИЛС (копия); Трудовая книжка (копия); Удостоверение грохотовщика',
          salary: '70 000 руб',
        },
        {
          vacancy: 'Директор по ремонтам',
          requirements:
            'Высшее техническое образование (горные машины и оборудование); Опыт работы на добывающих предприятиях (ПГР) от 5 лет; Знание программ: MS Office, Еxcel, 1С',
          docs: 'Паспорт (копия); ИНН; СНИЛС (копия); Трудовая книжка (копия); Диплом',
          salary: '150 000 руб',
        },
      ],
    },
  },
  {
    title: 'АО «Аметистовое»',
    photos: {
      create: [
        {
          small: 'path/to/file.png',
          large: 'path/to/file.png',
          alt: 'Паровоз',
        },
        {
          small: 'path/to/file.png',
          large: 'path/to/file.png',
          alt: 'Слиток',
        },
        {
          small: 'path/to/file.png',
          large: 'path/to/file.png',
          alt: 'Поселок',
        },
      ],
    },
    logo: 'path/to/file.png',
    marker: {
      create: {
        value: 'Аметистовое',
        top: 20,
        left: 24,
        corner: 'top-right',
      },
    },
    contacts:
      '+7 (914) 020-63-27 (Надежда Евгеньевна Селезнева); +7 (924) 790-49-63 (Екатерина Сергеевна Воронова); +7 (914) 997-65-40 (Екатерина Викторовна Зарезова)',
    vacancies: {
      create: [
        {
          vacancy: 'Грохотовщик',
          requirements:
            'Среднее полное образование; Опыт работы в аналогичной должности от 1 года',
          docs: 'Паспорт (копия); ИНН, СНИЛС (копия); Трудовая книжка (копия); Удостоверение грохотовщика',
          salary: '70 000 руб',
        },
        {
          vacancy: 'Главный механик',
          requirements:
            'Высшее профессиональное (техническое) образование; Опыт работы не менее 5 лет в горнодобывающих предприятиях на руководящих должностях; Знание программ: MS Office, Еxcel, 1С',
          docs: 'Паспорт (копия); ИНН; СНИЛС (копия); Трудовая книжка (копия); Диплом',
          salary: '120 000 руб',
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const {
    title,
    logo,
    contacts,
    vacancies,
    photos,
    marker,
  } of enterpriseData) {
    const user = await prisma.enterprise.create({
      data: {
        title,
      },
    });
    console.log(`Created user with id: ${user.id}`);
    const updatedUser = await prisma.enterprise.update({
      where: { id: user.id },
      data: {
        logo,
        contacts,
        vacancies,
        photos,
        marker,
      },
    });
    console.log(`Updated user with id: ${updatedUser.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
