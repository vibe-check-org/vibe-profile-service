import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VibeProfil } from '../model/entity/profil.entity.js';
import { VibeProfilService } from '../service/profil.service.js';
import { VibeSkillScore } from '../model/entity/vibe-skill-score.entity.js';
import { Roles } from 'nest-keycloak-connect';
import { KeycloakGuard } from '../../security/keycloak/guards/keycloak.guard.js';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';

@Resolver(() => VibeProfil)
@UseGuards(KeycloakGuard)
@UseInterceptors(ResponseTimeInterceptor)
export class VibeProfilResolver {
    readonly #service: VibeProfilService;
    constructor(service: VibeProfilService) {
        this.#service = service;
    }

    @Query(() => VibeProfil, { nullable: true })
    @Roles({ roles: ['Admin', 'BEWERBER', 'RECRUITER'] })
    vibeProfil(@Args('userId') userId: string) {
        return this.#service.getProfil(userId);
    }

    @Mutation(() => VibeProfil)
    @Roles({ roles: ['Admin', 'BEWERBER', 'RECRUITER'] })
    berechneVibeProfil(
        @Args('userId') userId: string,
        @Args('skills', { type: () => [VibeSkillScore] })
        skills: VibeSkillScore[],
    ) {
        return this.#service.createOrUpdateProfil(userId, skills);
    }
}
