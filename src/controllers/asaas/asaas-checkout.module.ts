import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsaasModule } from 'src/services/asaas/asaas.module';
import { User } from 'src/controllers/user/user.entity';
import { AsaasCheckout } from './entity/asaas-checkout.entity';
import { AsaasCheckoutController } from './asaas-checkout.controller';
import { AsaasCheckoutService } from './asaas-checkout.service';
import { BankSlipModule } from 'src/controllers/documents/bank-slip/bank-slip.module';
import { FinancialModule } from 'src/controllers/financial/financial.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AsaasCheckout, User]),
    AsaasModule,
    forwardRef(() => BankSlipModule),
    forwardRef(() => FinancialModule),
  ],
  controllers: [AsaasCheckoutController],
  providers: [AsaasCheckoutService],
  exports: [AsaasCheckoutService],
})
export class AsaasCheckoutModule {}
