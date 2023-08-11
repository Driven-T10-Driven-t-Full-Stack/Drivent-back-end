import { AuthenticatedRequest } from "@/middlewares";
import { Request, Response } from "express";
import pdfkit from 'pdfkit';
import enrollmentRepository from "@/repositories/enrollment-repository";
import eventRepository from "@/repositories/event-repository";
import ticketService from "@/services/tickets-service";
import dayjs from "dayjs";

export async function getCertificate(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    try {
        const user = await enrollmentRepository.findWithAddressByUserId(userId)
        const event = await eventRepository.findFirst()
        const ticket = await ticketService.getTicketByUserId(user.id)
        
        const startDate = dayjs(event.startsAt).format('DD/MM/YYYY')
        const endDate = dayjs(event.endsAt).format('DD/MM/YYYY')

        
        const doc = new pdfkit({ layout: 'landscape' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline`);
       
        doc.pipe(res);
        doc.rect(0, 0, 80, doc.page.height).fill('lightgray');
        doc.translate(40, 20);
        doc.fillColor('black').font('Helvetica').fontSize(80).text('CERTIFICADO ', { align: 'center' });
        doc.translate(0, 20);
        doc.fontSize(14).text(`Certificamos, para todos os devidos fins, de que a(o):`, { align: 'center' });
        doc.translate(0, 20);
        doc.font('Helvetica').fontSize(80).text(`${user.name}`, { align: 'center' });
        doc.fontSize(14).text(`Com documento ${user.cpf} participou do evento ${event.title}, de forma ${ticket.TicketType.isRemote ? "Remoto" : "Presencial"}, entre os dias ${startDate} e ${endDate}`);

        const leftSpacingPercentage = 0.4; // 50%
        const maxWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const leftSpacing = maxWidth * leftSpacingPercentage;

        doc.translate(leftSpacing, 100);

        doc.image('src/assets/driven.png', {
            fit: [100, 100],
            align: 'center',
            valign: 'center',
        });
        doc.end();
    } catch (error) {

    }


}