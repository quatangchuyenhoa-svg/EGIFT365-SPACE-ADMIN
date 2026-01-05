import { defineType, defineField } from 'sanity'

/**
 * Home Banner Schema - Hero Background Carousel
 *
 * Manages 3 auto-sliding background images for home page hero section
 * Supports autoplay configuration via CMS
 */
export default defineType({
  name: 'homeBanner',
  title: '🏠 Home Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'bannerImages',
      title: 'Banner Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enable focal point selection
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Accessibility description for the image',
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1).max(3).error('Must have 1-3 images'),
      description: 'Upload 1-3 minimalist background images for hero section (recommended: 1920x1080)',
    }),

    defineField({
      name: 'autoplayDelay',
      title: 'Autoplay Delay (milliseconds)',
      type: 'number',
      initialValue: 5000,
      validation: Rule => Rule.required().min(2000).max(10000).error('Delay must be between 2-10 seconds'),
      description: 'Time between slide transitions (default: 5000ms = 5 seconds)',
    }),

    defineField({
      name: 'enableAutoplay',
      title: 'Enable Autoplay',
      type: 'boolean',
      initialValue: true,
      description: 'Auto-advance slides or require manual navigation',
    }),

    defineField({
      name: 'pauseOnHover',
      title: 'Pause on Hover',
      type: 'boolean',
      initialValue: true,
      description: 'Pause autoplay when user hovers over carousel',
    }),
    
    defineField({
      name: 'isVisible',
      title: 'Show Banner',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show or hide the home banner on the homepage',
    }),
  ],

  preview: {
    select: {
      images: 'bannerImages',
      autoplay: 'enableAutoplay',
      delay: 'autoplayDelay',
      visible: 'isVisible',
    },
    prepare({ images, autoplay, delay, visible }) {
      const imageCount = images?.length || 0;
      const status = autoplay ? `Auto-slide (${delay}ms)` : 'Manual';
      const visibility = visible === false ? 'Hidden' : 'Visible';

      return {
        title: '🏠 Home Banner',
        subtitle: `${imageCount} ${imageCount === 1 ? 'image' : 'images'} • ${status} • ${visibility}`,
        media: images?.[0], // Show first image as preview
      };
    },
  },
})
