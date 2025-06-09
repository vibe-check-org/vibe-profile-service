import { InputType, Field } from '@nestjs/graphql';
import { VibeSkillScore } from '../entity/vibe-skill-score.entity';

@InputType()
export class CreateVibeProfilInput {
    @Field()
    userId: string;

    @Field(() => [VibeSkillScore])
    skills: VibeSkillScore[];
}
