import z from "zod";

export const DomainSchema = z.object({
  domainname: z.string().min(2, "Enter valid Username"),
});
