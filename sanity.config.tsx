import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { DeletePostAction } from "./sanity/actions/deletePost";
import { NavbarActions } from "./sanity/components/NavbarActions";
import {
  BookIcon,
  BulbOutlineIcon,
  DocumentsIcon,
  TagIcon,
  FolderIcon,
} from "@sanity/icons";
import React from "react";

/**
 * Custom Logo Component - Đẳng cấp & Tinh tế
 */
const StudioLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 4px' }}>
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #95442C 0%, #EB9947 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(149, 68, 44, 0.3)'
    }}>
      <span style={{ fontSize: '18px', color: 'white' }}>🍂</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ 
        fontSize: '16px', 
        fontWeight: '800', 
        color: '#2d2a26', 
        letterSpacing: '0.05em',
        lineHeight: '1.2',
        fontFamily: 'serif'
      }}>
        EGIFT SPACE
      </span>
      <span style={{ 
        fontSize: '10px', 
        color: '#95442C', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Studio Pro Max
      </span>
    </div>
  </div>
);

// CSS Inject for Pro Max Experience
const StudioStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* ============================================
       EGIFT STUDIO — PRO MAX THEME
       ============================================ */

    /* —— NAVBAR — Subtle accent only (don't override Sanity defaults) —— */
    [data-ui="Navbar"] {
      border-bottom: 2px solid rgba(149, 68, 44, 0.12) !important;
    }

    /* —— SIDEBAR / PANE LIST —— */
    [data-testid="structure-tool-list-pane"] {
      background: linear-gradient(180deg, #faf6ef 0%, #f5ede0 100%) !important;
    }

    /* Pane headers */
    [data-ui="PaneHeader"] {
      background: transparent !important;
      border-bottom: 1px solid rgba(149, 68, 44, 0.08) !important;
    }

    /* —— DOCUMENT LIST ITEMS —— */
    [data-testid="document-list-item"] {
      border-radius: 12px !important;
      margin: 2px 8px !important;
      padding: 4px 8px !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      border: 1px solid transparent !important;
    }
    [data-testid="document-list-item"]:hover {
      background: rgba(235, 153, 71, 0.08) !important;
      border-color: rgba(235, 153, 71, 0.2) !important;
      transform: translateX(6px) !important;
      box-shadow: 0 2px 12px rgba(149, 68, 44, 0.08) !important;
    }
    [data-testid="document-list-item"][data-selected="true"],
    [data-testid="document-list-item"][aria-selected="true"] {
      background: linear-gradient(135deg, rgba(149, 68, 44, 0.1) 0%, rgba(235, 153, 71, 0.12) 100%) !important;
      border-color: rgba(149, 68, 44, 0.25) !important;
      box-shadow: 0 2px 16px rgba(149, 68, 44, 0.1) !important;
    }

    /* —— EDITOR PANE (Right Column — Document Editor) —— */
    [data-testid="document-panel-scroller"] {
      background: #f0ebe3 !important;
    }
    [data-testid="document-panel-scroller"] > div {
      max-width: 860px;
      margin: 0 auto;
    }

    /* —— FORM FIELDS — Premium Input Styling —— */
    [data-testid="document-panel-scroller"] input[type="text"],
    [data-testid="document-panel-scroller"] input[type="url"],
    [data-testid="document-panel-scroller"] input[type="number"],
    [data-testid="document-panel-scroller"] textarea,
    [data-ui="TextInput"],
    [data-ui="TextArea"] {
      border-radius: 10px !important;
      border: 1.5px solid #ddd5c8 !important;
      background: #fffdf9 !important;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.02) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      padding: 10px 14px !important;
    }
    [data-testid="document-panel-scroller"] input:focus,
    [data-testid="document-panel-scroller"] textarea:focus,
    [data-ui="TextInput"]:focus-within,
    [data-ui="TextArea"]:focus-within {
      border-color: #95442C !important;
      box-shadow: 0 0 0 3px rgba(149, 68, 44, 0.1), 0 4px 16px rgba(149, 68, 44, 0.06) !important;
      background: #fff !important;
    }

    /* Field labels — bolder & warmer */
    [data-testid="document-panel-scroller"] label {
      font-weight: 600 !important;
      color: #3d2e1e !important;
      letter-spacing: 0.01em !important;
    }

    /* Field descriptions — softer */
    [data-testid="document-panel-scroller"] [data-ui="Text"][data-muted="true"] {
      color: #8a7b6a !important;
      font-size: 12px !important;
    }

    /* —— TABS (Group tabs) — The Star of the Show —— */
    [role="tablist"] {
      gap: 6px !important;
      padding: 6px 8px !important;
      background: rgba(149, 68, 44, 0.04) !important;
      border-radius: 14px !important;
      border: 1px solid rgba(149, 68, 44, 0.06) !important;
      margin-bottom: 8px !important;
    }
    [role="tab"] {
      border-radius: 10px !important;
      padding: 8px 16px !important;
      font-weight: 500 !important;
      font-size: 13px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      border: 1px solid transparent !important;
      color: #6b5d4a !important;
    }
    [role="tab"]:hover {
      background: rgba(149, 68, 44, 0.06) !important;
      color: #95442C !important;
    }
    [role="tab"][aria-selected="true"] {
      background: linear-gradient(135deg, #95442C 0%, #b85a35 100%) !important;
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(149, 68, 44, 0.25), 0 1px 3px rgba(0,0,0,0.1) !important;
      border-color: transparent !important;
      font-weight: 700 !important;
    }
    [role="tab"][aria-selected="true"] *,
    [role="tab"][aria-selected="true"] span {
      color: #fff !important;
    }

    /* —— BUTTONS — Polished & Tactile —— */
    [data-ui="Button"] {
      border-radius: 10px !important;
      font-weight: 600 !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    [data-ui="Button"]:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
    }
    [data-ui="Button"]:active {
      transform: translateY(0) !important;
    }

    /* Publish button — glow effect */
    [data-testid="action-Publish"] {
      background: linear-gradient(135deg, #95442C, #b85a35) !important;
      box-shadow: 0 4px 16px rgba(149, 68, 44, 0.3) !important;
    }
    [data-testid="action-Publish"]:hover {
      box-shadow: 0 6px 24px rgba(149, 68, 44, 0.4) !important;
    }

    /* —— SWITCH / BOOLEAN TOGGLES —— */
    [data-ui="Switch"][data-checked] {
      background-color: #95442C !important;
    }

    /* —— IMAGE UPLOAD AREA —— */
    [data-testid="file-input-button"] {
      border: 2px dashed #d4c4a8 !important;
      border-radius: 16px !important;
      background: rgba(253, 248, 240, 0.5) !important;
      transition: all 0.3s ease !important;
    }
    [data-testid="file-input-button"]:hover {
      border-color: #95442C !important;
      background: rgba(149, 68, 44, 0.04) !important;
    }

    /* —— DOCUMENT STATUS BAR (Published / Draft badges) —— */
    [data-ui="StatusButton"] {
      border-radius: 20px !important;
    }

    /* —— SCROLLBAR — Thin & Branded —— */
    [data-testid="document-panel-scroller"]::-webkit-scrollbar {
      width: 6px;
    }
    [data-testid="document-panel-scroller"]::-webkit-scrollbar-track {
      background: transparent;
    }
    [data-testid="document-panel-scroller"]::-webkit-scrollbar-thumb {
      background: rgba(149, 68, 44, 0.2);
      border-radius: 10px;
    }
    [data-testid="document-panel-scroller"]::-webkit-scrollbar-thumb:hover {
      background: rgba(149, 68, 44, 0.4);
    }

    /* —— FIELDSET BORDERS —— */
    fieldset {
      border: 1px solid rgba(149, 68, 44, 0.08) !important;
      border-radius: 14px !important;
      padding: 16px !important;
      background: rgba(253, 248, 240, 0.3) !important;
    }

    /* —— PORTABLE TEXT EDITOR —— */
    [data-testid="pt-editor"] {
      border-radius: 12px !important;
      border: 1.5px solid #ddd5c8 !important;
      background: #fffdf9 !important;
    }
    [data-testid="pt-editor"]:focus-within {
      border-color: #95442C !important;
      box-shadow: 0 0 0 3px rgba(149, 68, 44, 0.08) !important;
    }

    /* —— DIALOG / MODAL —— */
    [data-ui="Dialog"] [data-ui="Card"] {
      border-radius: 16px !important;
      box-shadow: 0 24px 80px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1) !important;
    }

    /* —— SMOOTH PAGE TRANSITIONS —— */
    [data-ui="Pane"] {
      animation: paneFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes paneFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* —— REFERENCE INPUT —— */
    [data-ui="Autocomplete"] {
      border-radius: 10px !important;
    }
  ` }} />
);

export default defineConfig({
  name: "egift-studio",
  title: "EGift Space Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio", // Studio sẽ chạy tại /studio

  // Studio appearance
  studio: {
    components: {
      logo: StudioLogo,
      navbar: (props) => (
        <>
          <StudioStyles />
          <NavbarActions {...props} />
        </>
      ),
    },
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Quản lý Nội dung")
          .items([
            // --- MAIN CONTENT ---
            S.listItem()
              .title("Kho Tri Thức")
              .icon(BookIcon)
              .child(
                S.documentTypeList("knowledgeItem")
                  .title("Kho Tri Thức")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.listItem()
              .title("Kho Quan Niệm")
              .icon(BulbOutlineIcon)
              .child(
                S.documentTypeList("concept")
                  .title("Kho Quan Niệm")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.listItem()
              .title("Câu Chuyện Nội Tâm")
              .icon(DocumentsIcon)
              .child(
                S.documentTypeList("innerStory").title("Danh sách Câu chuyện")
              ),

            S.divider(),

            // --- CLASSIFICATION ---
            S.listItem()
              .title("Phân loại & Danh mục")
              .icon(FolderIcon)
              .child(
                S.list()
                  .title("Phân loại")
                  .items([
                    S.listItem()
                      .title("Danh mục bài viết")
                      .icon(TagIcon)
                      .child(S.documentTypeList("category").title("Danh mục bài viết")),
                    S.listItem()
                      .title("Danh mục câu chuyện")
                      .icon(TagIcon)
                      .child(S.documentTypeList("innerStoryCategory").title("Danh mục câu chuyện")),
                  ])
              ),

            // Hide automatically generated items that we manually added above
            ...S.documentTypeListItems().filter(
              (item) => !["knowledgeItem", "concept", "innerStory", "homeBanner", "category", "innerStoryCategory", "blockContent"].includes(item.getId() as string)
            ),
          ]),
    }),
    visionTool(),    // GROQ query tool
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add custom delete action for knowledge and concepts
      if (['knowledgeItem', 'concept'].includes(context.schemaType)) {
        return [...prev, DeletePostAction]
      }

      return prev
    },
  },
});
