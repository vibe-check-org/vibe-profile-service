import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './model/entity/entities.js';
import { KafkaModule } from '../messaging/kafka.module.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { VibeProfilResolver } from './resolver/profil.resolver.js';
import { VibeProfilService } from './service/profil.service.js';

@Module({
    imports: [
        forwardRef(() => KafkaModule),
        TypeOrmModule.forFeature(entities),
        KeycloakModule,
    ],
    // Provider sind z.B. Service-Klassen fuer DI
    providers: [VibeProfilResolver, VibeProfilService],
    // Export der Provider fuer DI in anderen Modulen
    exports: [VibeProfilService],
})
export class ProfileModule {}
