import { Repository } from 'typeorm';
import { VibeProfil } from '../model/entity/profil.entity.js';
import { VibeSkillScore } from '../model/entity/vibe-skill-score.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VibeProfilService {
    readonly #repo: Repository<VibeProfil>;
    constructor(
        @InjectRepository(VibeProfil)
        repo: Repository<VibeProfil>,
    ) {
        this.#repo = repo;
    }

    async createOrUpdateProfil(
        userId: string,
        skills: VibeSkillScore[],
    ): Promise<VibeProfil> {
        const existing = await this.#repo.findOneBy({ userId });

        if (existing) {
            existing.skills = skills;
            return this.#repo.save(existing);
        }

        const profil = this.#repo.create({ userId, skills });
        return await this.#repo.save(profil);
    }

    async getProfil(userId: string): Promise<VibeProfil | null> {
        return await this.#repo.findOneBy({ userId });
    }
}
