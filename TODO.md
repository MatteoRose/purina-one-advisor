# TODO -- Current Sprint

## Cart Icon Clickable
- [x] Wrap cart badge in `<Link href="/cart">` in Header.tsx
- [x] Add hover/cursor styles
- [x] Test navigation works with 0 items and with items

## Background & Layout Improvement
- [x] Fix hero background cutoff below trust indicators
- [x] Enhance BackgroundEffects with richer gradients / mesh effect
- [x] Add animated glow spots for visual depth
- [x] Add warm undertones (burgundy, amber) to break up flatness
- [x] Add grain/noise texture overlay
- [x] Audit questionnaire page backgrounds
- [x] Audit results page backgrounds
- [x] Audit cart page backgrounds
- [x] Audit confirmation page backgrounds
- [x] Ensure consistency across all routes (page-specific accent gradients added)

## Personalized Nutrition Tip Bank
- [x] Expand tips database in src/lib/tips.ts
- [x] Add lifestage-specific tips (puppy, adult, senior) -- 6 per lifestage
- [x] Add activity-level-specific tips -- 3 per level
- [x] Add health-concern-specific tips (digestion, joints, coat, weight, dental, immunity) -- 3-4 per concern
- [x] Add weight-range-specific tips (light/medium/heavy ranges)
- [x] Add combination tips (e.g., senior + joints, puppy + high activity) -- 20+ combos
- [x] Update NutritionTip component with polished styling
- [x] Update tip selection to prioritize combo tips for max personalization
- [x] Source content from Purina-style nutrition guidance
- [x] Total: 60+ tips in the bank

## Visual Polish
- [x] Page-specific accent gradients on all routes
- [x] Enhanced BackgroundEffects with animated elements + light mode support
- [x] NutritionTip component refined (better shadow, transitions)
- [x] Mobile-friendly padding adjusted (px-4 sm:px-6 pattern)

## 3D Depth & Card Shadows
- [x] InteractiveCard: shadow-lg base, shadow-xl+red glow when selected, inset box-shadow
- [x] ChoiceButton: shadow-lg base, shadow-xl+red glow when selected
- [x] RecommendationCard: shadow-2xl for primary, shadow-lg for secondary, shadow-inner on images
- [x] WeightStep: shadow-xl on slider card

## Light Mode Enhancement
- [x] Warm cream palette (#FDF8F6 base, #FFF5F3 hover, #E8DDD8 borders)
- [x] Warm text colors (#1A1110 title, #4A3F3C body, #8A7B76 muted)
- [x] Warm scrollbar colors (#D4C4BC thumb)
- [x] Light-mode slider styling override
- [x] Theme-aware BackgroundEffects (warm rose/peach gradients in light mode)

## Mobile Cart Popup
- [x] Fix AddToCartFeedback position with safe-area-aware bottom
- [x] Popup confirmed working via DOM inspection (opacity transitions correctly)

## Deploy
- [ ] Commit all changes
- [ ] Push to GitHub (auto-deploys to Vercel)
- [ ] Verify live site
