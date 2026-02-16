import { LocalizationOptions } from "../localization";
import bad_actor_list from "./bad-actor-list";

export class AccountNameValidator {
  public static validate_account_name(
    value: string,
    localization: LocalizationOptions,
  ): string | null {
    if (!value) {
      return localization.accountNameWrongLength;
    }
    const length = value.length;
    if (length < 3) {
      return localization.accountNameWrongLength;
    }
    if (length > 16) {
      return localization.accountNameWrongLength;
    }
    if (bad_actor_list.includes(value)) {
      return localization.accountNameBadActor;
    }
    const ref = value.split(".");
    for (let i = 0, len = ref.length; i < len; i++) {
      const label = ref[i];
      if (!/^[a-z]/.test(label)) {
        return localization.accountNameWrongSegment;
      }
      if (!/^[a-z0-9-]*$/.test(label)) {
        return localization.accountNameWrongSegment;
      }
      if (!/[a-z0-9]$/.test(label)) {
        return localization.accountNameWrongSegment;
      }
      if (!(label.length >= 3)) {
        return localization.accountNameWrongSegment;
      }
    }
    return null;
  }
}
