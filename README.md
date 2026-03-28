# OpenClaw Blog

A modern, responsive blog for the OpenClaw ecosystem. This blog showcases tutorials, updates, and insights about building with OpenClaw.

## Features

- 🎨 **Modern Design** - Clean, responsive layout with dark/light theme support
- 📱 **Mobile Friendly** - Works perfectly on all device sizes
- 🚀 **Fast Loading** - Static HTML/CSS/JS for optimal performance
- 📝 **Blog System** - Markdown-based posts with categories and metadata
- 🎯 **Interactive Elements** - Dynamic post loading, theme toggling, smooth scrolling
- 🔗 **Community Links** - Direct connections to OpenClaw resources

## Live Demo

Visit the blog at: [https://phucsystem-dev.github.io/openclaw-built-blog/](https://phucsystem-dev.github.io/openclaw-built-blog/)

## Project Structure

```
openclaw-built-blog/
├── index.html          # Main page
├── README.md           # This file
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Interactive features
├── posts/
│   ├── getting-started.md
│   └── building-skills.md
├── images/             # Blog images (placeholder)
└── .gitignore          # Git ignore rules
```

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/phucsystem-dev/openclaw-built-blog.git
   cd openclaw-built-blog
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

### Adding New Posts

1. Create a new markdown file in the `posts/` directory:
   ```markdown
   ---
   title: "Your Post Title"
   date: "YYYY-MM-DD"
   author: "Author Name"
   category: "Category"
   excerpt: "Brief description"
   ---
   
   # Your Post Content
   
   Write your blog post here...
   ```

2. Add the post to the `blogPosts` array in `js/main.js`:
   ```javascript
   {
       id: 7,
       title: "Your Post Title",
       excerpt: "Brief description",
       category: "Category",
       date: "YYYY-MM-DD",
       readTime: "X min",
       icon: "fas fa-icon-name"
   }
   ```

### Customization

#### Changing Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    /* ... other variables */
}
```

#### Adding Features
- **New Sections**: Add HTML to `index.html` and corresponding CSS
- **Interactive Elements**: Extend `js/main.js`
- **API Integration**: Add fetch calls to load dynamic content

## Deployment

### Automatic Deployment with GitHub Actions
This blog includes GitHub Actions workflows that automatically deploy to GitHub Pages when you push to the `main` branch.

Two workflows are included:
1. `.github/workflows/deploy.yml` - Simple deployment
2. `.github/workflows/static.yml` - Standard GitHub Pages deployment

**To enable automatic deployment:**

1. Push the code to GitHub (already done)
2. Go to Repository Settings → Pages
3. Select "GitHub Actions" as the source
4. The next push will trigger automatic deployment

Your site will be published at: `https://phucsystem-dev.github.io/openclaw-built-blog/`

### Manual Deployment
If you prefer manual deployment:

1. Go to Repository Settings → Pages
2. Select "Deploy from a branch"
3. Choose `main` branch and `/ (root)` folder
4. Save

### Custom Domain
1. Add a `CNAME` file with your domain
2. Configure DNS settings at your domain registrar
3. Update GitHub Pages settings with your custom domain

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive features
- **Font Awesome** - Icons
- **Google Fonts** - Typography
- **GitHub Pages** - Hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built for the [OpenClaw](https://openclaw.ai) community
- Inspired by modern blog designs
- Thanks to all contributors and the open-source community

## Contact

- GitHub: [@phucsystem-dev](https://github.com/phucsystem-dev)
- OpenClaw Discord: [https://discord.gg/clawd](https://discord.gg/clawd)
- OpenClaw Docs: [https://docs.openclaw.ai](https://docs.openclaw.ai)

---

Made with ❤️ for the OpenClaw community