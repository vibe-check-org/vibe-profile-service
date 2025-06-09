/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
    Entity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';
import { VibeSkillScore } from './vibe-skill-score.entity.js';

@ObjectType()
@Entity()
export class VibeProfil {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({ unique: true })
    @Field()
    userId: string;

    @Column({ type: 'jsonb' })
    @Field(() => [VibeSkillScore])
    skills: VibeSkillScore[];

    @CreateDateColumn()
    @Field()
    erstelltAm: Date;
}
