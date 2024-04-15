/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './provider.entity';
import { FilterProviderDto } from './provider.dto';
@Injectable()
export class ProviderService {
    constructor(
        @InjectRepository(Provider) private readonly provideRepository: Repository<Provider>
    ) { }

    async createProvider(body: Provider, property_id: string): Promise<Provider> {
        body.type = "Fornecedor";
        body.property = property_id;
        return await this.provideRepository.save(body);
    }

    async createPartner(body: Provider, property_id: string): Promise<Provider> {
        body.type = "Parceiro";
        body.property = property_id;
        return await this.provideRepository.save(body);
    }

    async findOne(id: string): Promise<Provider> {
        return await this.provideRepository.findOne({ where: { id } });
    }

    async findAll(property: string): Promise<Provider[]> {
        return this.provideRepository.find({ where: { property }, order: { name: 'ASC' } });
    }

    async getProviders(property: string): Promise<Provider[]> {
        return this.provideRepository.find({
            order: { name: 'ASC' },
            where: { type: 'Fornecedor', property }
        });
    }

    async getPartners(property: string): Promise<Provider[]> {
        return this.provideRepository.find({
            order: { name: 'ASC' },
            where: { type: 'Parceiro', property }
        });
    }

    async update(id: string, body: any): Promise<Provider> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Provider nao encontrado', HttpStatus.BAD_REQUEST);
        }

        await this.provideRepository.update(id, body);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const verify = await this.findOne(id);
        if (!verify) {
            throw new HttpException('Provider nao encontrado', HttpStatus.BAD_REQUEST);
        }
        await this.provideRepository.delete(id);
    }

    async findFiltered(body: FilterProviderDto): Promise<Provider[]> {
        const queryBuilder = this.provideRepository.createQueryBuilder('provider');

        if (body.initialDate) {
            queryBuilder.andWhere('provider.createdAt >= :initialDate', {
                initialDate: body.initialDate,
            });
        }

        if (body.lastDate) {
            queryBuilder.andWhere('provider.createdAt <= :lastDate', {
                lastDate: body.lastDate,
            });
        }

        if (body.name) {
            queryBuilder.andWhere('provider.name = :name', { name: body.name });
        }

        if (body.type) {
            queryBuilder.andWhere('provider.type = :type', { type: body.type });
        }

        if (body.order && (body.order.toUpperCase() === 'ASC' || body.order.toUpperCase() === 'DESC')) {
            queryBuilder.addOrderBy('provider.createdAt', body.order as 'ASC' | 'DESC');
        }

        return queryBuilder.getMany();
    }

    filterByProperty(arrayFiltered: any, property: string): any[] {
        if (arrayFiltered.lenght > 0) {
            const providers = [];

            for (const provider of arrayFiltered) {
                if (provider.property === property) {
                    providers.push(provider);
                }
            }

            return providers;
        }
        else {
            return arrayFiltered;
        }
    }

}