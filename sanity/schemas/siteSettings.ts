import { defineType, defineField } from 'sanity'
import { ColorInput } from '../components/ColorInput'

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
  title: 'Site Settings',
  type: 'document',
  groups: [
    {
      name: 'theme',
      title: '🎨 Theme Colors',
    },
  ],
  fields: [
    // ========== THEME TOGGLE ==========
    defineField({
      name: 'enableTheme',
      title: 'Enable Custom Theme',
      type: 'boolean',
      group: 'theme',
      initialValue: true,
      description: '⚠️ Tắt để dùng màu mặc định từ globals.css thay vì màu từ Sanity',
    }),

    // ========== BACKGROUND COLORS (6) ==========
    defineField({
      name: 'headerBg',
      title: 'Header Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#FFFFFF',
      description: 'Màu nền thanh điều hướng (header)',
    }),
    defineField({
      name: 'bodyBg',
      title: 'Body Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#FDFBF7',
      description: 'Màu nền trang chính ',
    }),
    defineField({
      name: 'sectionBg',
      title: 'Section Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#F8F5F1',
      description: 'Màu nền các section ',
    }),
    defineField({
      name: 'footerBg',
      title: 'Footer Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#69372A',
      description: 'Màu nền footer',
    }),
    defineField({
      name: 'surfaceBg',
      title: 'Surface Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#FFFFFF',
      description: 'Màu nền thẻ, panel, container',
    }),
    defineField({
      name: 'overlayBg',
      title: 'Overlay Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#F5F1EB',
      description: 'Màu nền modal, popup, overlay',
    }),

    // ========== BUTTON COLORS (4) ==========
    defineField({
      name: 'buttonPrimaryBg',
      title: 'Primary Button Background',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#EB9947',
      description: 'Màu nút bấm chính CTA',
    }),
    defineField({
      name: 'buttonPrimaryHover',
      title: 'Primary Button Hover',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#D68331',
      description: 'Màu nút chính khi hover',
    }),
    defineField({
      name: 'buttonOutlineText',
      title: 'Outline Button Text',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#EB9947',
      description: 'Màu chữ nút outline',
    }),
    defineField({
      name: 'buttonOutlineBorder',
      title: 'Outline Button Border',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#EB9947',
      description: 'Màu viền nút outline',
    }),

    // ========== TEXT COLORS (4) ==========
    defineField({
      name: 'textForeground',
      title: 'Text Foreground (Default)',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#1B140E',
      description: 'Màu chữ mặc định (ghi đè shadcn --foreground)',
    }),
    defineField({
      name: 'textHeading',
      title: 'Heading Text',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#3D2817',
      description: 'Màu tiêu đề H1, H2, H3',
    }),
    defineField({
      name: 'textBody',
      title: 'Body Text',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#69372A',
      description: 'Màu đoạn văn, nội dung chính',
    }),
    defineField({
      name: 'textHover',
      title: 'Link Hover Text',
      type: 'string',
      group: 'theme',
      components: { input: ColorInput },
      validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/).error('Must be hex color'),
      initialValue: '#D68331',
      description: 'Màu link khi hover',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: '🎨 Cài Đặt Trang',
        subtitle: 'Màu sắc: 14 màu admin → 50 design tokens',
      }
    },
  },
})
