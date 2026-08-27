import z from 'zod';

export const registerUserSchema = z.object({
    username: z.string().min(4, 'Username have at least 4 characters'),
    email: z.email('Please enter a valid email adress'),
    age: z.number().gt(0,'I dont think you are THAT young.'),
    password: z.string()
    .min(8,'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[!@#$%^&*().,?":{}|<>_-]/, 'Password must contain at least one special character')
});

export type Register = z.infer<typeof registerUserSchema>;