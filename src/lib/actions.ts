import { loginSchema as schema } from "@/lib/loginSchema";
import prisma from "@/lib/prisma";
import { executeAction } from "@/lib/executeAction";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await prisma.user.create({
        data: {
          userType: "vis", // Adding required userType field
          updatedAt: new Date(),
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
    successMessage: "Login feito com sucesso",
  });
};

export { signUp };