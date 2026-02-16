export class PreliminarySanitizer {
  public static preliminary_sanitize(text: string): string {
    return PreliminarySanitizer.strip_html_comments(text);
  }

  private static strip_html_comments(text: string): string {
    return text.replace(
      /<!--([\s\S]+?)(-->|$)/g,
      "",
    );
  }
}
