# Static Website Project

This project is a simple static website that can be hosted on GitHub Pages. It includes HTML, CSS, and JavaScript files to create a fully functional web page.

## Project Structure

```
static-website
├── src
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── scripts.js
│   └── index.html
├── .gitignore
├── .github
│   └── workflows
│       └── deploy.yml
└── README.md
```

## Files Description

- **src/index.html**: The main HTML document for the static website. It includes references to the CSS and JavaScript files and contains the structure of the webpage.

- **src/css/styles.css**: Contains the styles for the website, defining the appearance of HTML elements using CSS rules.

- **src/js/scripts.js**: Contains JavaScript code for the website, used to add interactivity and dynamic behavior to the webpage.

- **.gitignore**: Specifies files and directories that should be ignored by Git, such as `node_modules`, logs, and environment files.

- **.github/workflows/deploy.yml**: Contains the GitHub Actions workflow configuration for deploying the static website to GitHub Pages. It defines the steps to build and deploy the site whenever changes are pushed to the repository.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open `src/index.html` in your web browser to view the website.
4. Make changes to the CSS and JavaScript files as needed to customize the appearance and functionality of the website.

## Deployment

To deploy the website to GitHub Pages, push your changes to the main branch. The GitHub Actions workflow defined in `.github/workflows/deploy.yml` will automatically build and deploy the site.

## License

This project is licensed under the MIT License.