import type { ToolbarItem } from "../types.js";
import { noop_result } from "./helpers.js";
import {
  bold_action,
  italic_action,
  strikethrough_action,
  code_action,
  code_block_action,
  is_bold_active,
  is_italic_active,
  is_strikethrough_active,
  is_code_active,
  is_code_block_active,
} from "./formatting.js";
import {
  heading_action,
  horizontal_rule_action,
  quote_action,
  table_action,
  is_heading_active,
  is_quote_active,
} from "./structure.js";
import { link_action, image_action, spoiler_action } from "./insert.js";
import {
  unordered_list_action,
  ordered_list_action,
  task_list_action,
  is_unordered_list_active,
  is_ordered_list_active,
  is_task_list_active,
} from "./lists.js";

function separator_item(key: string): ToolbarItem {
  return {
    type: "separator",
    label: "",
    action: {
      execute: (ctx) => noop_result(ctx),
    },
  } satisfies ToolbarItem & { _key?: string };
}

export const DEFAULT_TOOLBAR: ToolbarItem[] = [
  // -- Formatting --
  {
    type: "bold",
    label: "Bold",
    icon: "Bold",
    shortcut: "Mod-B",
    action: { execute: bold_action, isActive: is_bold_active },
  },
  {
    type: "italic",
    label: "Italic",
    icon: "Italic",
    shortcut: "Mod-I",
    action: { execute: italic_action, isActive: is_italic_active },
  },
  {
    type: "strikethrough",
    label: "Strikethrough",
    icon: "Strikethrough",
    shortcut: "Mod-Shift-S",
    action: {
      execute: strikethrough_action,
      isActive: is_strikethrough_active,
    },
  },
  {
    type: "code",
    label: "Inline Code",
    icon: "Code",
    shortcut: "Mod-E",
    action: { execute: code_action, isActive: is_code_active },
  },

  separator_item("sep-1"),

  // -- Structure --
  {
    type: "heading",
    label: "Heading",
    icon: "Heading",
    action: { execute: heading_action, isActive: is_heading_active },
  },
  {
    type: "quote",
    label: "Quote",
    icon: "Quote",
    action: { execute: quote_action, isActive: is_quote_active },
  },
  {
    type: "horizontal_rule",
    label: "Horizontal Rule",
    icon: "Minus",
    action: { execute: horizontal_rule_action },
  },
  {
    type: "code_block",
    label: "Code Block",
    icon: "FileCode",
    action: { execute: code_block_action, isActive: is_code_block_active },
  },
  {
    type: "table",
    label: "Table",
    icon: "Table",
    action: { execute: table_action },
  },

  separator_item("sep-2"),

  // -- Insert --
  {
    type: "link",
    label: "Link",
    icon: "Link",
    shortcut: "Mod-K",
    action: { execute: link_action },
  },
  {
    type: "image",
    label: "Image",
    icon: "Image",
    action: { execute: image_action },
  },
  {
    type: "spoiler",
    label: "Spoiler",
    icon: "EyeOff",
    action: { execute: spoiler_action },
  },

  separator_item("sep-3"),

  // -- Lists --
  {
    type: "unordered_list",
    label: "Unordered List",
    icon: "List",
    action: {
      execute: unordered_list_action,
      isActive: is_unordered_list_active,
    },
  },
  {
    type: "ordered_list",
    label: "Ordered List",
    icon: "ListOrdered",
    action: {
      execute: ordered_list_action,
      isActive: is_ordered_list_active,
    },
  },
  {
    type: "task_list",
    label: "Task List",
    icon: "ListChecks",
    action: { execute: task_list_action, isActive: is_task_list_active },
  },
];
