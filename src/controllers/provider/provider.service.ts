/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './provider.entity';
import { FilterProviderDto, SupplierTypeDto, SupplierTypeEditDto } from './provider.dto';
import { SupplierType } from './supplier-type.entity';
import { AsaasService } from 'src/services/asaas/asaas.service';
import { CreateCostumerDto } from 'src/services/asaas/dto/customers.dto';
@Injectable()
export class ProviderService {
    private readonly logger = new Logger(ProviderService.name);

    constructor(
        @InjectRepository(Provider) private readonly provideRepository: Repository<Provider>,
        @InjectRepository(SupplierType) private readonly supplierTypeRepository: Repository<SupplierType>,
        private readonly asaasService: AsaasService,
    ) { }

    async createSupplierType(body: SupplierTypeDto): Promise<SupplierType> {
        const normalizedName = body.name?.trim();
        if (!normalizedName) {
            throw new HttpException('Nome do tipo de fornecedor é obrigatório', HttpStatus.BAD_REQUEST);
        }

        const existing = await this.supplierTypeRepository
            .createQueryBuilder('supplierType')
            .where('LOWER(supplierType.name) = LOWER(:name)', { name: normalizedName })
            .getOne();

        if (existing) {
            throw new HttpException('Tipo de fornecedor já cadastrado', HttpStatus.BAD_REQUEST);
        }

        const supplierType = this.supplierTypeRepository.create({
            name: normalizedName,
            description: body.description?.trim() || '',
            active: true,
        });

        return this.supplierTypeRepository.save(supplierType);
    }

    async findAllSupplierTypes(): Promise<SupplierType[]> {
        return this.supplierTypeRepository.find({
            order: { active: 'DESC', name: 'ASC' },
        });
    }

    async findAllActiveSupplierTypes(): Promise<SupplierType[]> {
        return this.supplierTypeRepository.find({
            where: { active: true },
            order: { name: 'ASC' },
        });
    }

    async updateSupplierType(id: string, body: SupplierTypeEditDto): Promise<SupplierType> {
        const supplierType = await this.supplierTypeRepository.findOne({ where: { id } });

        if (!supplierType) {
            throw new HttpException('Tipo de fornecedor não encontrado', HttpStatus.BAD_REQUEST);
        }

        if (body.name && body.name.trim() !== supplierType.name) {
            const existing = await this.supplierTypeRepository
                .createQueryBuilder('supplierType')
                .where('LOWER(supplierType.name) = LOWER(:name)', { name: body.name.trim() })
                .andWhere('supplierType.id != :id', { id })
                .getOne();

            if (existing) {
                throw new HttpException('Tipo de fornecedor já cadastrado', HttpStatus.BAD_REQUEST);
            }

            supplierType.name = body.name.trim();
        }

        if (body.description !== undefined) {
            supplierType.description = body.description?.trim() || '';
        }

        if (body.active !== undefined) {
            supplierType.active = body.active;
        }

        supplierType.updated_at = new Date();

        return this.supplierTypeRepository.save(supplierType);
    }

    async deleteSupplierType(id: string): Promise<void> {
        const supplierType = await this.supplierTypeRepository.findOne({ where: { id } });

        if (!supplierType) {
            throw new HttpException('Tipo de fornecedor não encontrado', HttpStatus.BAD_REQUEST);
        }

        await this.supplierTypeRepository.delete(id);
    }

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

        const cpfCnpj = String(body.cpf || '').replace(/\D/g, '');
        if (!cpfCnpj) {
            throw new HttpException(
                'CPF/CNPJ é obrigatório para criar cliente no Asaas',
                HttpStatus.BAD_REQUEST,
            );
        }

        const address =
            body.adress?.find((item) => item.mainAdress || item.billingAddress) ||
            body.adress?.[0];

        const phone = String(body.personalPhone || body.comercialPhone || '').replace(
            /\D/g,
            '',
        );

        const customerData = {
            cpfCnpj,
            name: body.name,
            ...(body.email ? { email: body.email } : {}),
            phone: phone || undefined,
            mobilePhone: phone || undefined,
            postalCode: address?.cep
                ? String(address.cep).replace(/\D/g, '')
                : undefined,
            address: address?.streetAddress || undefined,
            addressNumber:
                address?.numberAddress != null
                    ? String(address.numberAddress)
                    : undefined,
            complement: address?.complement || undefined,
            province: address?.district || undefined,
            externalReference: property_id,
        } as CreateCostumerDto;

        try {
            const asaasCustomer = await this.asaasService.createCostumer(customerData);
            body.asaas_id = asaasCustomer.id;
        } catch (error) {
            this.logger.error(
                'Erro ao criar cliente no Asaas',
                JSON.stringify(error?.response?.data || error?.message || error),
            );

            const asaasErrors = error?.response?.data?.errors;
            const asaasMessage = Array.isArray(asaasErrors)
                ? asaasErrors.map((item) => item.description).join('; ')
                : null;

            throw new HttpException(
                asaasMessage || 'Não foi possível criar o cliente no Asaas',
                HttpStatus.BAD_REQUEST,
            );
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