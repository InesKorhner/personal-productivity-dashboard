# Error Handling System - Design Tokens

## Standardizovani Error Handling Sistem

### ErrorMessage Komponenta
- **Wrapper**: `border-destructive/50 bg-destructive/10 rounded-lg border p-4`
- **Animation**: `animate-in fade-in-0 slide-in-from-top-2 duration-200`
- **Layout**: Responsive - column na mobile, row na desktop

### Error Message Elementi

#### Ikona
- **Komponenta**: `AlertCircle` iz lucide-react
- **Stil**: `text-destructive size-5 shrink-0`

#### Tekst
- **Stil**: `text-destructive text-sm font-semibold break-words`
- **Layout**: `flex min-w-0 items-center gap-3`

#### Actions
- **Retry Button**: `variant="outline" size="sm"` sa `RefreshCw` ikonom
- **Dismiss Button**: `variant="ghost" size="sm"` sa `X` ikonom
- **Spacing**: `gap-2` između buttons

### Props
- `message`: string - error poruka
- `onRetry?`: () => void - callback za retry akciju
- `onDismiss?`: () => void - callback za dismiss akciju
- `retryLabel?`: string - tekst za retry button (default: "Retry")

### Best Practices
- Uvek koristiti ErrorMessage komponentu umesto custom error UI-ja
- Konzistentan tekst za retry button ("Retry")
- Smooth fade-in animacije za error messages
- Responsive layout za mobile i desktop

