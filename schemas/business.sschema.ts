// schemas/business.ts
import { z } from "zod";

const businessSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.string(),
  longitude: z.string(),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

export default businessSchema;