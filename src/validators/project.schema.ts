import { z } from 'zod';

const projectSchema = z.object({
    projectName: z.string().min(1, 'Project title is required'),
    projectDescription: z.string().min(1, 'Project description is required'),
});

const projectUpdateSchema = z.object({
    projectName: z.string().min(1, 'Project title is required').optional(),
    projectDescription: z.string().min(1, 'Project description is required').optional(),
})

export { projectSchema, projectUpdateSchema };
