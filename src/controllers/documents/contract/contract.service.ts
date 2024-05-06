/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { FilterContractDto } from './contract.dto';
import { AnimalService } from 'src/controllers/animal/animal.service';
import { join } from 'path';
import { S3Service } from 'src/controllers/s3/s3.service';
const PDFDocument = require('pdfkit-table');
@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
        @Inject(forwardRef(() => AnimalService)) private readonly animalService: AnimalService,
        private readonly s3Service: S3Service,

    ) { }

    async create(body: any): Promise<any> {
        const { payment, installments } = body;

        // Verifica se payment é true(a vista) e installments não é nulo
        if (payment && installments !== null) {
            body.installments = null;
        }

        // Verifica se payment é false(parcelado) e installments é nulo ou tem menos de 1 item
        if (!payment && (installments === null || installments.length < 1)) {
            throw new HttpException('Pagamento parcelado tem que ter no mínimo 2 itens.', HttpStatus.BAD_REQUEST);
        }

        const newContract = await this.contractRepository.save(body);
        const url = await this.generatePdf(newContract);
        newContract.pdf_url = url;
        await this.contractRepository.update(newContract.contract_number, newContract);

        return newContract;
    }

    async findByNumber(contract_number: string): Promise<any> {
        return await this.contractRepository.findOne({ where: { contract_number } });
    }

    async findByProperty(property: string): Promise<any> {
        return this.contractRepository.find({ where: { property } });
    }

    async findAll(): Promise<any> {
        return this.contractRepository.find();
    }

    async update(contract_number: string, body: any): Promise<any> {
        const verify = await this.findByNumber(contract_number);

        if (!verify) {
            throw new HttpException('Contrato não encontrado', HttpStatus.BAD_REQUEST);
        }

        const { payment, installments } = body;

        // Verifica se payment é true(a vista) e installments não é nulo
        if (payment && installments !== null) {
            body.installments = null;
        }

        // Verifica se payment é false(parcelado) e installments é nulo ou tem menos de 1 item
        if (!payment && (installments === null || installments.length < 1)) {
            throw new HttpException('Pagamento parcelado tem que ter no mínimo 2 itens.', HttpStatus.BAD_REQUEST);
        }

        body.contract_number = verify.contract_number;
        body.property = verify.property;

        if (verify.pdf_url !== '') {
            await this.s3Service.deleteFileS3(verify.pdf_url);
            const url = await this.generatePdf(body);
            body.pdf_url = url;
        }
        else {
            const url = await this.generatePdf(body);
            body.pdf_url = url;
        }

        await this.contractRepository.update(contract_number, body);
        return this.findByNumber(contract_number);
    }

    async findFiltered(body: FilterContractDto): Promise<any[]> {
        const queryBuilder = this.contractRepository.createQueryBuilder('contract');

        if (body.initialDate) {
            queryBuilder.andWhere('contract.date >= :initialDate', {
                initialDate: body.initialDate,
            });
        }

        if (body.lastDate) {
            queryBuilder.andWhere('contract.date <= :lastDate', {
                lastDate: body.lastDate,
            });
        }

        if (body.provider) {
            queryBuilder.andWhere('contract.provider = :provider', { provider: body.provider });
        }

        if (body.animal_name) {
            queryBuilder.andWhere('contract.animal_name = :animal_name', { animal_name: body.animal_name });
        }

        if (body.event) {
            queryBuilder.andWhere('contract.event = :event', { event: body.event });
        }

        if (body.order && (body.order.toUpperCase() === 'ASC' || body.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('contract.date', body.order as 'ASC' | 'DESC');
        }

        return queryBuilder.getMany();
    }

    async delete(contract_number: string): Promise<void> {
        const contrato = await this.findByNumber(contract_number);
        if (contrato.pdf_url !== "") {
            await this.s3Service.deleteFileS3(contrato.pdf_url);
        }
        await this.contractRepository.delete(contract_number);
    }

    async generatePdf(contrato: any): Promise<string> {
        const animal = await this.animalService.findOne(contrato.animal_id);
        const pdfBuffer: Buffer = await new Promise(resolve => {
            const doc = new PDFDocument(
                {
                    size: "LETTER",
                    bufferPages: true
                })

            // Imagem no topo
            const imageX = (doc.page.width - 70) / 2;
            doc.image(join(process.cwd(), "src/assets/6af3b4.png"), imageX, 15, { width: 70, height: 55, align: 'center' })
            doc.moveDown();

            // Quebra de Linha e ajuste do texto
            doc.text('');
            doc.moveDown();

            // Título
            doc.font("Helvetica-Bold").fontSize(14).text(`${contrato.title}`, { align: 'center' });
            doc.moveDown();

            // Cliente
            doc.font("Helvetica-Bold").fontSize(12).text('Comprador:', { continued: true });
            doc.font("Helvetica").fontSize(12).text(` ${contrato.provider}`);
            doc.moveDown();

            // Animal
            doc.font("Helvetica-Bold").fontSize(12).text('Detalhes do Animal:');
            doc.font("Helvetica").fontSize(12).text(`Nome do Animal: ${animal.name}`);
            doc.font("Helvetica").fontSize(12).text(`Raça: ${animal.race}`);
            doc.font("Helvetica").fontSize(12).text(`Sexo: ${animal.sex}`);
            doc.font("Helvetica").fontSize(12).text(`Pelagem: ${animal.coat}`);
            doc.moveDown();

            // Pagamento
            doc.font("Helvetica-Bold").fontSize(12).text('Valor e Termos de Pagamento:');
            doc.font("Helvetica").fontSize(12).text(`Valor de Pagamento: R$ ${contrato.value}`);
            if (contrato.payment) {
                doc.font("Helvetica").fontSize(12).text(`Tipo de Pagamento: À vista`);
            }
            else {
                doc.font("Helvetica").fontSize(12).text(`Tipo de Pagamento: Parcelado`);
            }
            doc.font("Helvetica").fontSize(12).text(`Status do Contrato: ${contrato.status}`);
            doc.moveDown();
            // Colocar uma tabela de parcelas?

            // Objeto do Contrato
            doc.font("Helvetica-Bold").fontSize(12).text('Objeto do Contrato:');
            doc.font("Helvetica").fontSize(12).text(` ${contrato.contract_object}`);
            doc.moveDown();

            // Condições Gerais
            doc.font("Helvetica-Bold").fontSize(12).text('Condições Gerais:');
            doc.font("Helvetica").fontSize(12).text('1. Qualquer alteração neste contrato deve ser feita por escrito e assinada por ambas as partes.', { align: 'justify' });
            doc.font("Helvetica").fontSize(12).text('2. Este contrato é regido pelas leis na República Federativa do Brasil.', { align: 'justify' });
            doc.font("Helvetica").fontSize(12).text('3. Em caso de litígio, as partes concordam em tentar resolver o problema de forma amigável. Se isso não for possível, as partes concordam com a jurisdição exclusiva dos tribunais competentes na República Federativa do Brasil.', { align: 'justify' });
            doc.moveDown();

            // Assinaturas
            doc.font("Helvetica-Bold").fontSize(12).text('Assinaturas:');
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(12).text('Vendedor: _____________________________');
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(12).text('CPF: _____________________________');
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(12).text('Comprador: _____________________________');
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(12).text('CPF: _____________________________');
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(12).text('Data: ____________________________');
            doc.moveDown();

            const buffer = []
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer)
                resolve(data)
            })

            doc.end()
        })

        const path = `stribo-bucket/contracts/${contrato.contract_number}`;
        const url = await this.s3Service.uploadS3(pdfBuffer, path, `${contrato.title}.pdf`);
        return url;
    }

}