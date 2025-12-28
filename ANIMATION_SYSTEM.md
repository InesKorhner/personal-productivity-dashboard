# Animation System - Design Tokens

## Standardizovani Animation Sistem

### Transition Duration
- **Fast**: `duration-150` (150ms) - za hover effects
- **Normal**: `duration-200` (200ms) - za standardne transitions
- **Slow**: `duration-300` (300ms) - za complex animations

### Transition Timing
- **Default**: `ease-in-out` - za većinu animacija
- **Ease-out**: `ease-out` - za fade-in effects
- **Ease-in**: `ease-in` - za fade-out effects

### Common Animations
- **Hover**: `transition-colors duration-200`
- **Focus**: `transition-all duration-200`
- **Dialog open**: fade-in + slide-in
- **List items**: fade-in + slide-up
- **Button press**: scale-down effect

### Animation Classes
- **Fade in**: `animate-in fade-in-0 duration-200`
- **Slide in**: `animate-in slide-in-from-bottom-2 duration-200`
- **Zoom in**: `animate-in zoom-in-95 duration-200`
- **Scale**: `transition-transform duration-200 hover:scale-105`

