import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido!",
  }),
  password: z
    .string()
    .min(5, {
      message: "A senha deve ter pelo menos 5 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
    }),
});

export const registerSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido",
  }),
  password: z
    .string()
    .min(5, {
      message: "A senha deve ter pelo menos 5 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
    }),
  userType: z.enum(["eng", "int"], {
    required_error: "Por favor, selecione um tipo de usuário",
  })
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido",
  }),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(5, {
      message: "A senha deve ter pelo menos 5 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordRequestData = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;