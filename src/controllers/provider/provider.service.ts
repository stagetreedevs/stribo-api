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

        if (body.adress.length > 0) {
            for (const address of body.adress) {
                const requiredFields = [
                    'billingAddress',
                    'cep',
                    'city',
                    'complement',
                    'country',
                    'description',
                    'district',
                    'mainAdress',
                    'numberAddress',
                    'streetAddress',
                    'others',
                    'state',
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                for (const field of requiredFields) {
                    if (!(field in address) || address[field] === null || address[field] === undefined) {
                        throw new HttpException('Endereço incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                    }
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(address).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Endereço inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (body.contacts.length > 0) {
            for (const contact of body.contacts) {
                const requiredFields = [
                    'name',
                    'phone',
                    'obs'
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                for (const field of requiredFields) {
                    if (!(field in contact) || contact[field] === null || contact[field] === undefined) {
                        throw new HttpException('Contato incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                    }
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(contact).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Contato inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (body.banks.length > 0) {
            for (const bank of body.banks) {
                const requiredFields = [
                    'name',
                    'account',
                    'agency'
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                for (const field of requiredFields) {
                    if (!(field in bank) || bank[field] === null || bank[field] === undefined) {
                        throw new HttpException('Banco incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                    }
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(bank).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Banco inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        return await this.provideRepository.save(body);
    }

    async createCustomer(body: Provider, property_id: string): Promise<Provider> {
        body.type = "Cliente";
        body.property = property_id;

        if (body.adress.length > 0) {
            for (const address of body.adress) {
                const requiredFields = [
                    'country',
                    'cep',
                    'streetAddress',
                    'numberAddress',
                    'billingAddress',
                    'mainAdress',
                    'others',
                    'complement',
                    'district',
                    'city',
                    'state',
                    'description',
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                for (const field of requiredFields) {
                    if (!(field in address) || address[field] === null || address[field] === undefined) {
                        throw new HttpException('Endereço incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                    }
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(address).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Endereço inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (body.contacts.length > 0) {
            for (const contact of body.contacts) {
                const requiredFields = [
                    'name',
                    'phone',
                    'obs'
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                for (const field of requiredFields) {
                    if (!(field in contact) || contact[field] === null || contact[field] === undefined) {
                        throw new HttpException('Contato incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                    }
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(contact).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Contato inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (body.banks.length > 0) {
            for (const bank of body.banks) {
                const requiredFields = [
                    'name',
                    'account',
                    'agency'
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                for (const field of requiredFields) {
                    if (!(field in bank) || bank[field] === null || bank[field] === undefined) {
                        throw new HttpException('Banco incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                    }
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(bank).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Banco inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

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
            where: { type: 'Cliente', property }
        });
    }

    async findAllNamesProvidersByProperty(property: string): Promise<any[]> {
        const providers = await this.provideRepository.find({
            order: { name: 'ASC' },
            where: { type: 'Fornecedor', property }
        });

        const labels: any[] = [];

        providers.forEach((provider) => {
            labels.push({ label: provider.name, value: provider.name });
        });

        return labels;
    }

    async findAllNamesCustomerByProperty(property: string): Promise<any[]> {
        const cutomers = await this.provideRepository.find({
            order: { name: 'ASC' },
            where: { type: 'Cliente', property }
        });
        const labels: any[] = [];

        cutomers.forEach((provider) => {
            labels.push({ label: provider.name, value: provider.name });
        });

        return labels;
    }

    async update(id: string, body: any): Promise<Provider> {
        const verify = await this.findOne(id);

        if (!verify) {
            throw new HttpException('Provider nao encontrado', HttpStatus.BAD_REQUEST);
        }

        if (body.adress.length > 0) {
            for (const address of body.adress) {
                const requiredFields = [
                    'country',
                    'cep',
                    'streetAddress',
                    'numberAddress',
                    'billingAddress',
                    'mainAdress',
                    'others',
                    'complement',
                    'district',
                    'city',
                    'state',
                    'description',
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                const missingFields = requiredFields.filter(field => !(field in address));
                if (missingFields.length > 0) {
                    throw new HttpException('Endereço incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(address).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Endereço inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (body.contacts.length > 0) {
            for (const contact of body.contacts) {
                const requiredFields = [
                    'name',
                    'phone',
                    'obs'
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                const missingFields = requiredFields.filter(field => !(field in contact));
                if (missingFields.length > 0) {
                    throw new HttpException('Contato incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(contact).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Contato inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
        }

        if (body.banks.length > 0) {
            for (const bank of body.banks) {
                const requiredFields = [
                    'name',
                    'account',
                    'agency'
                ];

                // Verificar se todos os campos obrigatórios estão presentes
                const missingFields = requiredFields.filter(field => !(field in bank));
                if (missingFields.length > 0) {
                    throw new HttpException('Banco incompleto. Campos faltantes.', HttpStatus.BAD_REQUEST);
                }

                // Verificar se há campos extras no objeto
                const extraFields = Object.keys(bank).filter(field => !requiredFields.includes(field));
                if (extraFields.length > 0) {
                    throw new HttpException('Banco inválido. Campos extras.', HttpStatus.BAD_REQUEST);
                }
            }
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

    async findFiltered(body: FilterProviderDto, property: string): Promise<Provider[]> {
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

        // FILTRA PELA PROPRIEDADE
        if (property) {
            queryBuilder.andWhere('provider.property = :property', { property: property });
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

}