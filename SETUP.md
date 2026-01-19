# ClothShare Setup Instructions

## For New Developers

### 1. Clone the repository
```bash
git clone https://github.com/chv-sneha/ClothShare.git
cd ClothShare
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get Supabase credentials from project owner and update `.env.local`:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_supabase_key
   ```

### 4. Start development server
```bash
npm run dev
```

## Common Issues

### Website shows only HTML (no styling/functionality)
- **Cause**: Missing environment variables or dependencies
- **Solution**: Follow steps 2 and 3 above

### Build errors
- **Cause**: Node version mismatch
- **Solution**: Use Node.js version 18 or higher

### Supabase connection errors
- **Cause**: Wrong environment variables
- **Solution**: Double-check Supabase URL and key in `.env.local`