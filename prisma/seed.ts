import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  const eventActivities = [
    {
      name: "Navegando no Mundo da Inteligência Artificial: Desmitificando Conceitos Complexos",
      startedTime: dayjs('2023-08-10').add(28, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(28, "days").set('hour', 12).toDate(),
      local: "LATERAL",
      capacity: 25,
      eventId: 1, 
    },
    {
      name: "Construindo Resiliência em Tempos de Mudança: Estratégias para Lidar com Desafios",
      startedTime: dayjs('2023-08-10').add(29, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(29, "days").set('hour', 12).toDate(),
      local: 'PRINCIPAL',
      capacity: 25,
      eventId: 1, 
    },
    {
      name: "Sustentabilidade na Prática: Iniciativas Empresariais para um Futuro Mais Verde",
      startedTime: dayjs('2023-08-10').add(30, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(30, "days").set('hour', 12).toDate(),
      local: 'WORKSHOP',
      capacity: 25,
      eventId: 1, 
    }
  ]
  let activities = await prisma.activity.findMany();
  if (activities.length === 0) {
    for(let i=0; i<eventActivities.length;i++){
      const activity = await prisma.activity.create({
        data: {
          name: eventActivities[i].name,
          startedTime: eventActivities[i].startedTime,
          finishedTime: eventActivities[i].finishedTime,
          local: eventActivities[i].local,
          capacity: eventActivities[i].capacity,
          eventId: eventActivities[i].eventId,
  },
      });
      activities = [...activities, activity]
    }
  }

  console.log({ activities });
  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
