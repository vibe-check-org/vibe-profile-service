/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VibeProfil } from '../model/entity/profil.entity.js';
import { VibeProfilService } from '../service/profil.service.js';
import { VibeSkillScore } from '../model/entity/vibe-skill-score.entity.js';

@Resolver(() => VibeProfil)
export class VibeProfilResolver {
    readonly #service: VibeProfilService;
    constructor(service: VibeProfilService) {
        this.#service = service;
    }

    @Query(() => VibeProfil, { nullable: true })
    vibeProfil(@Args('userId') userId: string) {
        return this.#service.getProfil(userId);
    }

    @Mutation(() => VibeProfil)
    berechneVibeProfil(
        @Args('userId') userId: string,
        @Args('skills', { type: () => [VibeSkillScore] })
        skills: VibeSkillScore[],
    ) {
        return this.#service.createOrUpdateProfil(userId, skills);
    }
}
