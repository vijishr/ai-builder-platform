# CONTRIBUTING.md

## Contributing Guidelines

Thank you for your interest in contributing to AI Builder!

### Code of Conduct
We are committed to providing a welcoming and inspiring community. Please read our Code of Conduct.

### How to Contribute

#### 1. Report Bugs
- Check if the bug has already been reported
- Provide a clear description
- Include steps to reproduce
- Mention your environment (OS, browser, Node version)

#### 2. Suggest Enhancements
- Explain the use case
- Describe the expected behavior
- Suggest alternatives

#### 3. Submit Pull Requests
- Fork the repository
- Create a feature branch (`git checkout -b feature/amazing-feature`)
- Commit changes (`git commit -m 'Add amazing feature'`)
- Push to branch (`git push origin feature/amazing-feature`)
- Open a Pull Request

### Development Setup

```bash
# Clone repo
git clone <repo-url>

# Install dependencies
npm run setup

# Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development
npm run dev
```

### Code Style
- Use ESLint for linting
- Follow Airbnb style guide
- Write meaningful commit messages
- Add comments for complex logic

### Testing
```bash
npm test
npm run test:coverage
```

### Pull Request Process
1. Update README.md if needed
2. Update tests
3. Ensure all tests pass
4. Request code review
5. Address review comments

---
