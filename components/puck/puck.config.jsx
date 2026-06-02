import ImageUploadField from "./ImageUploadField";
import ColorField from "./ColorField";
import { resolveColor } from "@/lib/puck/colors";

// Shared Puck configuration for event content.
//
// IMPORTANT: this module is intentionally isomorphic (NO "use client").
//   - Every component `render` function is server-safe (plain markup, no hooks,
//     plain <img>), so the public event page renders them via
//     `@puckeditor/core/rsc` with full SSR and no editor JS shipped to visitors.
//   - The Image field uses a custom client component (ImageUploadField), but
//     Puck only invokes field renders inside the editor — never during the
//     server render — so importing this into a Server Component is safe.

const ALIGN_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const colorField = {
  type: "custom",
  label: "Color",
  render: ({ value, onChange }) => (
    <ColorField value={value} onChange={onChange} />
  ),
};

export const puckConfig = {
  categories: {
    content: {
      title: "Content",
      components: ["Heading", "Text", "Image", "Button"],
    },
    layout: {
      title: "Layout",
      components: ["Columns", "Spacer", "Divider"],
    },
    advanced: {
      title: "Advanced",
      components: ["RawHtml"],
    },
  },

  components: {
    Heading: {
      label: "Heading",
      fields: {
        text: { type: "text", label: "Text" },
        level: {
          type: "select",
          label: "Level",
          options: [
            { label: "Heading 2", value: "h2" },
            { label: "Heading 3", value: "h3" },
            { label: "Heading 4", value: "h4" },
          ],
        },
        align: { type: "radio", label: "Align", options: ALIGN_OPTIONS },
        color: colorField,
      },
      defaultProps: {
        text: "Section heading",
        level: "h2",
        align: "left",
        color: "default",
      },
      render: ({ text, level, align, color }) => {
        const Tag = level || "h2";
        const style = { textAlign: align || "left" };
        const resolved = resolveColor(color);
        if (resolved) style.color = resolved;
        return (
          <Tag className="puck-heading" style={style}>
            {text}
          </Tag>
        );
      },
    },

    Text: {
      label: "Text",
      fields: {
        text: { type: "textarea", label: "Text" },
        align: { type: "radio", label: "Align", options: ALIGN_OPTIONS },
        size: {
          type: "select",
          label: "Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Normal", value: "base" },
            { label: "Large", value: "lg" },
          ],
        },
        weight: {
          type: "radio",
          label: "Weight",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Medium", value: "medium" },
            { label: "Bold", value: "bold" },
          ],
        },
        color: colorField,
      },
      defaultProps: {
        text: "Add your text here. Multiple paragraphs keep their line breaks.",
        align: "left",
        size: "base",
        weight: "normal",
        color: "default",
      },
      render: ({ text, align, size, weight, color }) => {
        const style = { textAlign: align || "left" };
        const resolved = resolveColor(color);
        if (resolved) style.color = resolved;
        return (
          <p
            className="puck-text"
            data-size={size || "base"}
            data-weight={weight || "normal"}
            style={style}
          >
            {text}
          </p>
        );
      },
    },

    Image: {
      label: "Image",
      fields: {
        src: {
          type: "custom",
          label: "Image",
          render: ({ value, onChange }) => (
            <ImageUploadField value={value} onChange={onChange} />
          ),
        },
        alt: { type: "text", label: "Alt text" },
        caption: { type: "text", label: "Caption" },
        width: {
          type: "select",
          label: "Width",
          options: [
            { label: "Full", value: "full" },
            { label: "Large", value: "large" },
            { label: "Medium", value: "medium" },
            { label: "Small", value: "small" },
          ],
        },
        align: { type: "radio", label: "Align", options: ALIGN_OPTIONS },
        rounded: {
          type: "radio",
          label: "Corners",
          options: [
            { label: "Square", value: "none" },
            { label: "Rounded", value: "lg" },
          ],
        },
      },
      defaultProps: {
        src: "",
        alt: "",
        caption: "",
        width: "full",
        align: "center",
        rounded: "lg",
      },
      render: ({ src, alt, caption, width, align, rounded }) => {
        if (!src) {
          return <div className="puck-image-empty">Select an image</div>;
        }

        return (
          <figure
            className="puck-image"
            data-width={width || "full"}
            data-align={align || "center"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || ""}
              data-rounded={rounded || "lg"}
              loading="lazy"
            />
            {caption ? <figcaption>{caption}</figcaption> : null}
          </figure>
        );
      },
    },

    Button: {
      label: "Button",
      fields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "Link (URL)" },
        variant: {
          type: "radio",
          label: "Style",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Outline", value: "outline" },
          ],
        },
        align: { type: "radio", label: "Align", options: ALIGN_OPTIONS },
      },
      defaultProps: {
        label: "Learn more",
        href: "#",
        variant: "primary",
        align: "left",
      },
      render: ({ label, href, variant, align }) => (
        <div className="puck-button-wrap" style={{ textAlign: align || "left" }}>
          <a
            className="puck-button"
            data-variant={variant || "primary"}
            href={href || "#"}
          >
            {label}
          </a>
        </div>
      ),
    },

    Columns: {
      label: "Columns",
      fields: {
        distribution: {
          type: "radio",
          label: "Distribution",
          options: [
            { label: "Equal", value: "equal" },
            { label: "Wide left", value: "wide-left" },
            { label: "Wide right", value: "wide-right" },
          ],
        },
        column1: { type: "slot" },
        column2: { type: "slot" },
      },
      defaultProps: {
        distribution: "equal",
      },
      render: ({ distribution, column1: Column1, column2: Column2 }) => (
        <div
          className="puck-columns"
          data-distribution={distribution || "equal"}
        >
          <div className="puck-column">
            <Column1 />
          </div>
          <div className="puck-column">
            <Column2 />
          </div>
        </div>
      ),
    },

    Spacer: {
      label: "Spacer",
      fields: {
        size: {
          type: "select",
          label: "Height",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra large", value: "xl" },
          ],
        },
      },
      defaultProps: { size: "md" },
      render: ({ size }) => (
        <div className="puck-spacer" data-size={size || "md"} aria-hidden="true" />
      ),
    },

    Divider: {
      label: "Divider",
      fields: {},
      render: () => <hr className="puck-divider" />,
    },

    RawHtml: {
      label: "Embed HTML",
      fields: {
        html: { type: "textarea", label: "HTML" },
      },
      defaultProps: { html: "" },
      render: ({ html }) => (
        <div
          className="puck-raw-html"
          dangerouslySetInnerHTML={{ __html: html || "" }}
        />
      ),
    },
  },
};

export default puckConfig;
