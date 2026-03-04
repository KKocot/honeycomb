import type {
  EditorActionContext,
  EditorActionResult,
  UploadHandler,
  UploadResult,
} from "../types.js";

const IMAGE_SIGNING_CHALLENGE = "ImageSigningChallenge";

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export interface HiveImageUploadConfig {
  imageEndpoint: string;
  username: string;
  signChallenge: (challenge: Uint8Array) => Promise<string>;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
}

function validate_file(
  file: File,
  max_size: number,
  accepted_types: string[],
): void {
  if (file.size > max_size) {
    const max_mb = Math.round(max_size / (1024 * 1024));
    throw new Error(
      `File "${file.name}" exceeds maximum size of ${max_mb}MB (${file.size} bytes)`,
    );
  }

  if (!accepted_types.includes(file.type)) {
    throw new Error(
      `File type "${file.type}" is not accepted. Allowed: ${accepted_types.join(", ")}`,
    );
  }
}

async function read_file_bytes(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

function build_signing_payload(file_bytes: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const prefix = encoder.encode(IMAGE_SIGNING_CHALLENGE);
  const payload = new Uint8Array(prefix.length + file_bytes.length);
  payload.set(prefix, 0);
  payload.set(file_bytes, prefix.length);
  return payload;
}

async function upload_to_imagehoster(
  file: File,
  endpoint: string,
  username: string,
  signature: string,
): Promise<string> {
  const form_data = new FormData();
  form_data.append("file", file);

  const url = `${endpoint}${username}/${signature}`;

  const response = await fetch(url, { method: "POST", body: form_data });

  if (!response.ok) {
    throw new Error(
      `Image upload failed: HTTP ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("url" in data) ||
    typeof (data as Record<string, unknown>).url !== "string"
  ) {
    throw new Error("Invalid response from imagehoster: missing url field");
  }

  return (data as Record<string, unknown>).url as string;
}

export function create_hive_upload_handler(
  config: HiveImageUploadConfig,
): UploadHandler {
  const max_size = config.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const accepted_types = config.acceptedTypes ?? DEFAULT_ACCEPTED_TYPES;

  return {
    maxFileSize: max_size,
    acceptedTypes: accepted_types,

    async upload(file: File): Promise<UploadResult> {
      validate_file(file, max_size, accepted_types);

      const file_bytes = await read_file_bytes(file);
      const payload = build_signing_payload(file_bytes);

      let signature: string;
      try {
        signature = await config.signChallenge(payload);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown signing error";
        throw new Error(`Failed to sign image challenge: ${message}`);
      }

      let url: string;
      try {
        url = await upload_to_imagehoster(
          file,
          config.imageEndpoint,
          config.username,
          signature,
        );
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("Image upload")) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Unknown network error";
        throw new Error(`Image upload network error: ${message}`);
      }

      return {
        url,
        alt: file.name,
      };
    },
  };
}

const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

export function extract_images_from_markdown(text: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null = MARKDOWN_IMAGE_REGEX.exec(text);
  while (match !== null) {
    urls.push(match[2]);
    match = MARKDOWN_IMAGE_REGEX.exec(text);
  }
  MARKDOWN_IMAGE_REGEX.lastIndex = 0;
  return urls;
}

export function insert_image_markdown(
  ctx: EditorActionContext,
  result: UploadResult,
): EditorActionResult {
  const alt = result.alt ?? "image";
  const image_text = `![${alt}](${result.url})`;
  const before = ctx.fullText.slice(0, ctx.selectionStart);
  const after = ctx.fullText.slice(ctx.selectionEnd);
  const new_cursor = ctx.selectionStart + image_text.length;

  return {
    text: before + image_text + after,
    selectionStart: new_cursor,
    selectionEnd: new_cursor,
  };
}
