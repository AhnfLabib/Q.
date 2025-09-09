# Q. - Your Personal Quote Library

A premium personal quote collection app with beautiful glassmorphism design. Collect, organize, and discover meaningful quotes that inspire you daily.

![Q. Quote Library](https://lovable.dev/opengraph-image-p98pqg.png)

## ✨ Features

- **📚 Quote Collection**: Save and organize your favorite quotes
- **🎨 Beautiful Design**: Glassmorphism UI with dark/light theme support
- **📱 Responsive**: Perfect experience on desktop and mobile
- **🔍 Smart Search**: Find quotes by content, author, or tags
- **💌 Daily Newsletter**: Receive daily inspiration via email
- **📤 Share Quotes**: Generate beautiful quote images to share
- **🔐 Secure Authentication**: User accounts with Supabase backend
- **⭐ Favorites**: Mark and organize your most cherished quotes

## 🚀 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **State Management**: TanStack Query
- **Routing**: React Router
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd q-quote-library

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and API key to .env

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🗄️ Database Schema

The app uses Supabase with the following main tables:

- **quotes** - Store user quotes with metadata
- **users** - User profiles and preferences
- **quote_favorites** - User favorite quotes
- **newsletter_subscriptions** - Email newsletter management

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

## 🎨 Design System

The app uses a custom design system built on:

- **Colors**: HSL-based color tokens in `index.css`
- **Components**: Customized shadcn/ui components
- **Typography**: Inter font family
- **Glassmorphism effects**: Custom CSS with backdrop-blur
- **Responsive breakpoints**: Tailwind CSS defaults

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Q.** - Where meaningful quotes find their home. ✨