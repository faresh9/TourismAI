# Tourism AI

A web application that generates personalized travel itineraries using AI. The app takes user input about their destination, dates, preferences and budget to create custom travel plans and blog posts.

## Features

- AI-powered travel itinerary generation
- Email delivery of itineraries
- Automatic blog post creation
- Date range selection
- Budget level options
- Travel preferences customization

## Tech Stack

- React + TypeScript
- Vite
- Supabase
- OpenAI GPT
- SMTP email integration

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   OPENAI_API_KEY=your_openai_key
   ```
4. Run development server: `npm run dev`

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: OpenAI API key for GPT integration

## API Endpoints

### Generate Itinerary
`POST /functions/v1/generate_itinerary`

Request body:

```json
{
  "destination": "Paris, France",
  "dates": ["2024-05-01", "2024-05-05"],
  "preferences": {
    "budget": "medium",
    "interests": ["history", "art", "shopping"]
  }
}
```

Response:

```json
{
  "itinerary": "<html>...</html>"
}
```

### Create Blog Post
`POST /functions/v1/create_blog_post`

Request body:

```json
{
  "itinerary": "<html>...</html>",
  "blog_title": "Travel Guide to Paris"
}
```

Response:

```json
{
  "blog_post": "<html>...</html>"
}
```

## Email Integration

The app uses SMTP email integration to send itineraries and blog posts to users. The email service is configured in the `.env` file:

```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Deployment

The app is deployed using Vercel. To deploy:

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


