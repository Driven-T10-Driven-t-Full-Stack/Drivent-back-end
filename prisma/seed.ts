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
  const ticketByType = [
    {
    name: 'Presencial',
    price: 250,
    isRemote: false,
    includesHotel: false,
  },
  {
    name: 'Presencial com hotel',
    price: 600,
    isRemote: false,
    includesHotel: true,
  },
  {
    name: 'Online',
    price: 150,
    isRemote: true,
    includesHotel: false,
  }
]
  let ticketsType = await prisma.ticketType.findMany();
  if (ticketsType.length < ticketByType.length){
    for(let i=0; i<ticketByType.length;i++){
      const ticketType = await prisma.ticketType.create({
        data: {
          name: ticketByType[i].name,
          price: ticketByType[i].price,
          isRemote: ticketByType[i].isRemote,
          includesHotel: ticketByType[i].includesHotel,
        }
      });
      ticketsType = [...ticketsType, ticketType]
    }
  }
  const eventHotels = [
    {
      name:"Marina Bay Sands",
      image: "https://www.qualviagem.com.br/wp-content/uploads/2019/12/iStock-617882378-e1576263812944.jpg",
    },
    {
      name:"Ritz Paris",
      image:"https://upload.wikimedia.org/wikipedia/commons/1/17/Hotel_Ritz_Paris.jpg",
    }
  ]
  const roomsHotel = [
    {
      name:"Deluxe Ocean View Suite",
      capacity: 3,
    },
    {
      name:"Executive King Room",
      capacity: 3,
    },
    {
      name:"Junior Suite with Balcony",
      capacity: 2,
    }
  ]
  let hotelsWithRooms = await prisma.hotel.findMany();
  let rooms = await prisma.room.findMany();
  if (hotelsWithRooms.length < eventHotels.length){
    for(let i=0; i<eventHotels.length; i++){
        const hotel = await prisma.hotel.create({
          data:{
            name: eventHotels[i].name,
            image: eventHotels[i].image,
          }
        })
      for(let j=0; j<roomsHotel.length; j++){
        const room = await prisma.room.create({
          data:{
            name: roomsHotel[j].name,
            capacity: roomsHotel[j].capacity,
            hotelId: hotel.id,
          }
        })
        rooms = [...rooms, room];
      }
      hotelsWithRooms = [...hotelsWithRooms, hotel];
    }
  }

  const eventActivities = [
    {
      name: "Navegando no Mundo da Inteligência Artificial: Desmitificando Conceitos Complexos",
      startedTime: dayjs('2023-08-10').add(28, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(28, "days").set('hour', 12).toDate(),
      local: "LATERAL",
      isRemote: false,
      capacity: 25,
      eventId: 1, 
    },
    {
      name: "Navegando no Mundo do React: Components são de comer?",
      startedTime: dayjs('2023-08-10').add(28, "days").set('hour', 14).toDate(),
      finishedTime: dayjs('2023-08-10').add(28, "days").set('hour', 16).toDate(),
      local: "PRINCIPAL",
      isRemote: false,
      capacity: 25,
      eventId: 1, 
    },
    {
      name: "Construindo Resiliência em Tempos de Mudança: Estratégias para Lidar com Desafios",
      startedTime: dayjs('2023-08-10').add(29, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(29, "days").set('hour', 12).toDate(),
      local: 'PRINCIPAL',
      isRemote: false,
      capacity: 25,
      eventId: 1, 
    },
    {
      name: "Sustentabilidade na Prática: Iniciativas Empresariais para um Futuro Mais Verde",
      startedTime: dayjs('2023-08-10').add(30, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(30, "days").set('hour', 12).toDate(),
      local: 'WORKSHOP',
      isRemote: false,
      capacity: 25,
      eventId: 1, 
    },
    {
      name: "Explorando Além: As Fronteiras da Inteligência Artificial",
      startedTime: dayjs('2023-08-10').add(28, "days").set('hour', 10).toDate(),
      finishedTime: dayjs('2023-08-10').add(28, "days").set('hour', 12).toDate(),
      local: 'ONLINE',
      isRemote: true,
      capacity: 0,
      eventId: 1, 
    },
    {
      name: "Caminhos para o Sucesso Empreendedor: Lições de Quem Já Chegou Lá",
      startedTime: dayjs('2023-08-10').add(29, "days").set('hour', 14).toDate(),
      finishedTime: dayjs('2023-08-10').add(29, "days").set('hour', 16).toDate(),
      local: 'ONLINE',
      isRemote: true,
      capacity: 0,
      eventId: 1, 
    },    {
      name: "Mindfulness no Mundo Moderno: Estratégias para Reduzir o Estresse e Melhorar o Bem-Estar",
      startedTime: dayjs('2023-08-10').add(30, "days").set('hour', 18).toDate(),
      finishedTime: dayjs('2023-08-10').add(30, "days").set('hour', 20).toDate(),
      local: 'ONLINE',
      isRemote: true,
      capacity: 0,
      eventId: 1, 
    }
  ]
  let activities = await prisma.activity.findMany();
  if (activities.length < eventActivities.length) {
    for(let i=0; i<eventActivities.length;i++){
      const activity = await prisma.activity.create({
        data: {
          name: eventActivities[i].name,
          startedTime: eventActivities[i].startedTime,
          finishedTime: eventActivities[i].finishedTime,
          local: eventActivities[i].local,
          isRemote: eventActivities[i].isRemote,
          capacity: eventActivities[i].capacity,
          eventId: eventActivities[i].eventId,
  },
      });
      activities = [...activities, activity]
    }
  }

  console.log({ event });
  console.log({ ticketsType });
  console.log({ hotelsWithRooms });
  console.log({ rooms });
  console.log({ activities });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
