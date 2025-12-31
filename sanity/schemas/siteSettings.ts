import { defineType, defineField } from 'sanity'
import { ColorInput } from '../components/ColorInput'
import { SiteSettingsPreview } from '../components/SiteSettingsPreview'

/**
 * Site Settings Schema - Color Theme Control
 *
 * Uses custom ColorInput component with @uiw/react-color
 * Visual color picker compatible with Sanity v4
 *
 * 14 admin colors → 50 design tokens in egift-client
 */
export default defineType({
  name: 'siteSettings',
  title: '🎨 Cài Đặt Giao Diện',
  type: 'document',
  groups: [
    {
      name: 'theme',
      title: '🎨 Màu Sắc Chủ Đề',
    },
  ],
  fieldsets: [
    {
      name: 'control',
      title: '⚙️ Điều Khiển',
      options: { collapsible: false },
    },
    {
      name: 'backgrounds',
      title: '🎭 Màu Nền',
      description: '6 màu nền chính cho các phần của trang',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'buttons',
      title: '🔘 Màu Nút Bấm',
      description: '4 màu cho các trạng thái nút',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'texts',
      title: '✍️ Màu Chữ',
      description: '4 màu cho tiêu đề, nội dung, và link',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    // ========== CONTROL ==========
    defineField({
      name: 'enableTheme',
      title: 'Bật Theme Tùy Chỉnh',
      type: 'boolean',
      fieldset: 'control',
      initialValue: true,
      description: '⚠️ Tắt để dùng màu mặc định từ globals.css',
    }),

    // ========== BACKGROUND COLORS (6) ==========
    defineField({
      name: 'headerBg',
      title: '📱 Header',
      type: 'string',
      fieldset: 'backgrounds',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#FFFFFF',
      description: 'Màu nền thanh điều hướng',
    }),
    defineField({
      name: 'bodyBg',
      title: '📄 Body',
      type: 'string',
      fieldset: 'backgrounds',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#FDFBF7',
      description: 'Màu nền trang chính',
    }),
    defineField({
      name: 'sectionBg',
      title: '📦 Section',
      type: 'string',
      fieldset: 'backgrounds',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#F8F5F1',
      description: 'Màu nền các section',
    }),
    defineField({
      name: 'footerBg',
      title: '🦶 Footer',
      type: 'string',
      fieldset: 'backgrounds',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#69372A',
      description: 'Màu nền footer',
    }),
    defineField({
      name: 'surfaceBg',
      title: '🎴 Surface',
      type: 'string',
      fieldset: 'backgrounds',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#FFFFFF',
      description: 'Màu nền thẻ, panel, container',
    }),
    defineField({
      name: 'overlayBg',
      title: '🔲 Overlay',
      type: 'string',
      fieldset: 'backgrounds',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#F5F1EB',
      description: 'Màu nền modal, popup, overlay',
    }),

    // ========== BUTTON COLORS (4) ==========
    defineField({
      name: 'buttonPrimaryBg',
      title: '🟠 Primary',
      type: 'string',
      fieldset: 'buttons',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#EB9947',
      description: 'Màu nút bấm chính CTA',
    }),
    defineField({
      name: 'buttonPrimaryHover',
      title: '🔶 Primary Hover',
      type: 'string',
      fieldset: 'buttons',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#D68331',
      description: 'Màu nút chính khi hover',
    }),
    defineField({
      name: 'buttonOutlineText',
      title: '⭕ Outline Text',
      type: 'string',
      fieldset: 'buttons',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#EB9947',
      description: 'Màu chữ nút outline',
    }),
    defineField({
      name: 'buttonOutlineBorder',
      title: '🔘 Outline Border',
      type: 'string',
      fieldset: 'buttons',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#EB9947',
      description: 'Màu viền nút outline',
    }),

    // ========== TEXT COLORS (4) ==========
    defineField({
      name: 'textForeground',
      title: '📝 Foreground',
      type: 'string',
      fieldset: 'texts',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#1B140E',
      description: 'Màu chữ mặc định (ghi đè shadcn --foreground)',
    }),
    defineField({
      name: 'textHeading',
      title: '📰 Heading',
      type: 'string',
      fieldset: 'texts',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#3D2817',
      description: 'Màu tiêu đề H1, H2, H3',
    }),
    defineField({
      name: 'textBody',
      title: '📖 Body',
      type: 'string',
      fieldset: 'texts',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#69372A',
      description: 'Màu đoạn văn, nội dung chính',
    }),
    defineField({
      name: 'textHover',
      title: '🔗 Link Hover',
      type: 'string',
      fieldset: 'texts',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#D68331',
      description: 'Màu link khi hover',
    }),
  ],
  preview: {
    select: {
      // Backgrounds
      headerBg: 'headerBg',
      bodyBg: 'bodyBg',
      sectionBg: 'sectionBg',
      footerBg: 'footerBg',
      surfaceBg: 'surfaceBg',
      overlayBg: 'overlayBg',
      // Buttons
      buttonPrimaryBg: 'buttonPrimaryBg',
      buttonPrimaryHover: 'buttonPrimaryHover',
      buttonOutlineText: 'buttonOutlineText',
      buttonOutlineBorder: 'buttonOutlineBorder',
      // Texts
      textForeground: 'textForeground',
      textHeading: 'textHeading',
      textBody: 'textBody',
      textHover: 'textHover',
    },
    prepare() {
      return {
        title: '🎨 Cài Đặt Trang',
        subtitle: 'Màu sắc: 14 màu admin → 50 design tokens',
      }
    },
  },
  components: {
    preview: SiteSettingsPreview,
  },
})
