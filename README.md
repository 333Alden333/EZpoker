# EZpoker

WORK IN PROGRESS, PROBABLY DOESN'T WORK YET 

A transparent overlay application for real-time GTO poker assistance, similar to Cluely.

## Features

✅ **Transparent Overlay Window**
- Always-on-top poker assistant
- Draggable and resizable
- Lock/unlock for click-through mode

✅ **Manual Input Mode**
- Enter hole cards, position, and stack size
- Real-time GTO recommendations
- Frequency-based strategy display

✅ **GTO Integration**
- Built-in GTO lookup tables
- Support for TexasSolver (free open-source solver)
- Position-aware recommendations

🔄 **Planned Features**
- Automatic card detection via OCR
- Screen capture and table recognition
- Opponent tracking and HUD stats
- Integration with TexasSolver API
- Machine learning for exploitative adjustments

## Installation

### 🚀 **Option 1: Download Ready-to-Use App (Easiest)**

**Mac Users:**
- [Download EZpoker-1.0.0.dmg](https://github.com/333Alden333/EZpoker/releases/latest) (Intel Macs)
- [Download EZpoker-1.0.0-arm64.dmg](https://github.com/333Alden333/EZpoker/releases/latest) (Apple Silicon M1/M2/M3)

**Windows/Linux:** Coming soon!

### 🔧 **Option 2: Build from Source**

```bash
# Clone and install dependencies
git clone https://github.com/333Alden333/EZpoker.git
cd EZpoker
npm install

# Run in development mode
npm run dev

# Build executables
npm run build:mac    # Mac .dmg files
npm run build:win    # Windows .exe installer  
npm run build:linux  # Linux .AppImage
```

## Usage

1. **Launch the app**: The overlay appears on the right side of your screen
2. **Manual input**: Enter your hole cards (e.g., "AsKh" for Ace of Spades, King of Hearts)
3. **Set position**: Choose your table position (UTG, MP, CO, BTN, SB, BB)
4. **Update stack**: Set your stack size in big blinds
5. **Get GTO advice**: Click "Update GTO" to see optimal play recommendations

## Controls

- **Lock Button (🔓/🔒)**: Toggle click-through mode
- **Minimize (--)**: Minimize window
- **Close (×)**: Close application
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + L`: Toggle lock
  - `Ctrl/Cmd + M`: Minimize

## GTO Solver Integration

Currently supports:
- **Built-in lookup tables** (limited range)
- **TexasSolver integration** (planned)

### Free GTO Solvers Available:
1. **TexasSolver** - Fast, open-source, completely free
2. **WASM Postflop** - Web-based solver
3. **Desktop Postflop** - Native desktop version

## Legal Notice

This tool is designed for:
- **Educational purposes** - Learn optimal poker strategy
- **Study mode** - Analyze hand scenarios offline
- **Training** - Practice GTO concepts

**Important**: Check your poker site's Terms of Service before using any overlay software during real money play.

## Technical Details

- **Framework**: Electron (Node.js + HTML/CSS/JS)
- **Transparency**: Native OS window transparency
- **Performance**: ~30fps for screen monitoring (when implemented)
- **Privacy**: All data stored locally

## Development Roadmap

### Phase 1: ✅ Core Overlay (Complete)
- [x] Transparent window system
- [x] Basic GTO lookup tables
- [x] Manual input interface
- [x] Window controls and dragging

### Phase 2: 🔄 Automation (In Progress)
- [ ] Screen capture integration
- [ ] OCR for card detection
- [ ] Table position recognition
- [ ] Stack size parsing

### Phase 3: 📋 Advanced Features (Planned)
- [ ] TexasSolver API integration
- [ ] Opponent tracking database
- [ ] Hand history logging
- [ ] Exploitative play suggestions

### Phase 4: 🤖 AI Enhancement (Future)
- [ ] Machine learning card detection
- [ ] Advanced opponent modeling
- [ ] Real-time adaptation algorithms

## Contributing

Feel free to contribute by:
- Adding new GTO ranges
- Improving OCR accuracy
- Enhancing the UI/UX
- Integrating additional solvers

## License

MIT License - Free for personal and educational use.
