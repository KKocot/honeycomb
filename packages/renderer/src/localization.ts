import { z } from "zod";

export const localization_schema = z.object({
  phishingWarning: z.string().min(1),
  externalLink: z.string().min(1),
  noImage: z.string().min(1),
  accountNameWrongLength: z.string().min(1),
  accountNameBadActor: z.string().min(1),
  accountNameWrongSegment: z.string().min(1),
});

export class Localization {
  public static validate(o: LocalizationOptions): void {
    localization_schema.parse(o);
  }

  public static DEFAULT: LocalizationOptions = {
    phishingWarning:
      "Link expanded to plain text; beware of a potential phishing attempt",
    externalLink: "This link will take you away from example.com",
    noImage: "Images not allowed",
    accountNameWrongLength:
      "Account name should be between 3 and 16 characters long",
    accountNameBadActor: "This account is on a bad actor list",
    accountNameWrongSegment:
      "This account name contains a bad segment",
  };
}

export interface LocalizationOptions {
  phishingWarning: string;
  externalLink: string;
  noImage: string;
  accountNameWrongLength: string;
  accountNameBadActor: string;
  accountNameWrongSegment: string;
}
