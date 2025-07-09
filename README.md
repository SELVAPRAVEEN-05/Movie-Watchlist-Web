# Movie Search & Watchlist App

A modern movie search and watchlist application built with Next.js 14, TypeScript, and Tailwind CSS. Features movie search using The Movie Database (TMDB) API, detailed movie information, and a personal watchlist stored in localStorage.

## Features

- 🎬 **Movie Search**: Search for movies using TMDB API
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔍 **Movie Details**: View detailed information about movies including cast, genres, and ratings
- 📝 **Watchlist Management**: Add/remove movies from your personal watchlist
- 🎯 **Pagination**: Navigate through search results and popular movies
- ⚡ **Fast Loading**: Optimized with Next.js 14 app router
- 🎨 **Modern UI**: Clean and intuitive interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: The Movie Database (TMDB) API
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx
│   └── watchlist/
│       └── page.tsx
├── components/
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── api.ts
│   └── watchlist.ts
└── types/
    └── movie.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB API key (get it from [TMDB](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-watchlist-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your TMDB API key to `.env.local`:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints Used

- `GET /search/movie` - Search for movies
- `GET /movie/popular` - Get popular movies
- `GET /movie/{id}` - Get movie details
- `GET /trending/movie/{time_window}` - Get trending movies
- `GET /movie/top_rated` - Get top-rated movies
- `GET /movie/upcoming` - Get upcoming movies

## Features in Detail

### Movie Search
- Real-time search with debounced input
- Search by movie title
- Fallback to popular movies when no search query

### Movie Details
- Comprehensive movie information
- Poster images with fallback
- Ratings, release date, runtime
- Genres and production companies
- Add/remove from watchlist

### Watchlist Management
- Persistent storage using localStorage
- Add/remove movies with instant feedback
- Watchlist counter in navigation
- Dedicated watchlist page

### Pagination
- Smart pagination with ellipsis
- Navigate through multiple pages of results
- Consistent across search and popular movies

## Customization

### Styling
The app uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in `src/app/globals.css`
- Individual component styling

### API Configuration
API settings can be modified in `src/lib/api.ts`:
- Base URL
- Default parameters
- Error handling

### Watchlist Storage
Currently uses localStorage. Can be extended to:
- Backend API storage
- User authentication
- Cloud sync

## Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons