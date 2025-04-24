# Pokedex-
Made a fun website where you can see different and also search them.

# PokéFinder - The Ultimate Pokédex

PokéFinder is an interactive web application that allows users to browse, search, and discover Pokémon from all generations. Built with HTML, CSS, and vanilla JavaScript, this responsive application provides a user-friendly interface to explore the world of Pokémon.



## Features

- **Browse Pokémon**: View Pokémon in a responsive grid layout with infinite scrolling
- **Search Functionality**: Find specific Pokémon by name or ID
- **Random Pokémon**: Discover random Pokémon with a single click
- **Detailed Information**: View comprehensive details about each Pokémon including:
  - Type classification with color-coded badges
  - Base stats with visual indicators
  - Physical attributes (height, weight)
  - Habitat and generation information
  - Special abilities
  - Evolution chain
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Animated UI**: Smooth transitions and animations enhance the user experience

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript (ES6+)
- [PokéAPI](https://pokeapi.co/) for Pokémon data
- [Animate.css](https://animate.style/) for animations
- [Google Fonts](https://fonts.google.com/) for typography

## File Structure

```
pokefinder/
│
├── index.html          # Main HTML file
├── pokedex.js          # JavaScript functionality
├── README.md           # Project documentation
└── screenshots/        # Project screenshots
    └── preview.png     # Main preview image
```

## Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of Git (for deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pokefinder.git
```

2. Navigate to the project directory:
```bash
cd pokefinder
```

3. Open `index.html` in your web browser or use a local development server.

## How It Works

- The application fetches data from the PokéAPI (https://pokeapi.co/)
- Pokémon are loaded in batches of 20 for efficient performance
- Each Pokémon card is color-coded based on its primary type
- Detailed information is displayed in a modal when a card is clicked
- The search function allows users to find specific Pokémon by name or ID
- The random function uses a random number generator to display a random Pokémon

## API Usage

This project uses the free and open PokéAPI. Please be aware of their [fair use policy](https://pokeapi.co/docs/v2#fairuse) when implementing or modifying this application.

## Future Enhancements

- Add filtering by type, generation, and other attributes
- Implement comparison feature to compare stats between Pokémon
- Add a favorites system with local storage
- Include move sets and breeding information
- Add language support for international users

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by [PokéAPI](https://pokeapi.co/)
- Pokémon is a trademark of Nintendo/Game Freak
- Font "Press Start 2P" by CodeMan38
- Icons from [Heroicons](https://heroicons.com/)

## Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/pokefinder](https://github.com/yourusername/pokefinder)
