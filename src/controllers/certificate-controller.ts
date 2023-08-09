import { AuthenticatedRequest } from "@/middlewares";
import { Request, Response } from "express";
import httpStatus from "http-status";
import pdfkit from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function getCertificate(req: AuthenticatedRequest, res: Response) {

    const nome = "Tais Carvalho"
    const cpf = "123345678"
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
    doc.font('Helvetica').fontSize(80).text(`${nome}`, { align: 'center' });
    doc.fontSize(14).text(`Com documento XXX.XXX.XXX-XX participou do evento XXX, de forma YYY, entre os dias DD/MM/AAAA e DD/MM/AA`);

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
}