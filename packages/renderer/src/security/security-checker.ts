export class SecurityChecker {
  public static check_security(
    text: string,
    props: { allowScriptTag: boolean },
  ): void {
    if (!props.allowScriptTag && this.contains_script_tag(text)) {
      throw new SecurityError(
        "Renderer rejected the input because of insecure content: text contains script tag",
      );
    }
  }

  private static contains_script_tag(text: string): boolean {
    return /<\s*script/gi.test(text);
  }
}

export class SecurityError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "SecurityError";
  }
}
