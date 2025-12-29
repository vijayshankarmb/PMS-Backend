import { z } from "zod";

export const createTaskSchema = z.object({
  taskName: z.string().min(3),
  taskDescription: z.string().min(5),
  projectId: z.string(),
  assignedTo: z.string(),
});

export const updateTaskSchema = z.object({
  taskName: z.string().min(3).optional(),
  taskDescription: z.string().min(5).optional(),
  assignedTo: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
});



