# Contributing to LuxeDrive

First off, thank you for considering contributing to LuxeDrive! It's people like you that make LuxeDrive such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.4.1+ (or npm/yarn)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**

   ```bash
   # Click 'Fork' on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/luxedrive.git
   cd luxedrive
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Make your changes**

   - Write code following our guidelines
   - Add tests if applicable
   - Update documentation

6. **Test your changes**
   ```bash
   pnpm build      # Ensure it builds
   pnpm preview    # Test production build
   ```

## 📝 Coding Guidelines

### JavaScript/React

- Use functional components with hooks
- Use const/let, never var
- Prefer arrow functions
- Use JSX for React components
- Keep components small and focused
- Use meaningful variable/function names

### Component Structure

```jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";

const ComponentName = ({ prop1, prop2 }) => {
  const { language, t } = useApp();
  const [state, setState] = useState(initialValue);

  // Event handlers
  const handleClick = () => {
    // ...
  };

  // Early returns
  if (!data) return <Loading />;

  // Main render
  return <div className="container">{/* Component content */}</div>;
};

export default ComponentName;
```

### Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Use consistent spacing (px-4, py-6, etc.)
- Prefer gradients: `from-blue-600 to-blue-800`
- Use semantic color names

### Localization

- Always use the `t()` function for user-facing text
- Add keys to both `en` and `ar` in AppContext
- Test in both languages
- Ensure RTL layout works correctly

Example:

```javascript
// Add to AppContext messages
'myKey': 'English text',  // in en
'myKey': 'نص عربي',        // in ar

// Use in component
{t('myKey')}
```

### Accessibility

- Always add `aria-label` to interactive elements
- Use semantic HTML (`nav`, `main`, `footer`, etc.)
- Add `role` attributes where needed
- Test keyboard navigation
- Ensure good color contrast

## 💬 Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(coupons): add vehicle-specific coupon scoping
fix(navbar): correct mobile menu accessibility
docs(readme): update installation instructions
style(footer): improve spacing and alignment
refactor(context): simplify state management
```

## 🔄 Pull Request Process

1. **Ensure your code:**

   - Builds without errors (`pnpm build`)
   - Follows the coding guidelines
   - Is properly documented
   - Works in both English and Arabic
   - Is accessible (keyboard navigation, ARIA labels)

2. **Update documentation:**

   - Update README.md if needed
   - Add comments to complex code
   - Update CHANGELOG.md

3. **Create Pull Request:**

   - Use a clear, descriptive title
   - Describe what changes you made and why
   - Reference any related issues
   - Add screenshots for UI changes
   - Test in both languages

4. **Wait for review:**
   - Address any feedback
   - Make requested changes
   - Be patient and respectful

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested in English
- [ ] Tested in Arabic (RTL)
- [ ] Tested on mobile
- [ ] Tested keyboard navigation
- [ ] No console errors

## Screenshots

(if applicable)

## Related Issues

Fixes #123
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, etc.)
│   └── ...          # Feature components
├── context/         # React Context (global state)
├── data/            # JSON data files
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   └── ...          # Public pages
└── utils/           # Helper functions
```

### Adding a New Feature

1. **Component in `src/components/`**

   ```jsx
   // MyFeature.jsx
   import { useApp } from "../context/AppContext";

   const MyFeature = () => {
     const { language, t } = useApp();
     return <div>{t("myFeature.title")}</div>;
   };

   export default MyFeature;
   ```

2. **Add translations in AppContext**

   ```javascript
   messages: {
     en: {
       'myFeature.title': 'My Feature'
     },
     ar: {
       'myFeature.title': 'ميزتي'
     }
   }
   ```

3. **Import and use**
   ```jsx
   import MyFeature from "./components/MyFeature";
   ```

## 🧪 Testing Checklist

Before submitting:

- [ ] Builds successfully (`pnpm build`)
- [ ] No console errors or warnings
- [ ] Works in English
- [ ] Works in Arabic (RTL layout correct)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (keyboard navigation, ARIA)
- [ ] Follows coding guidelines
- [ ] Code is commented where needed
- [ ] Documentation updated

## 🐛 Bug Reports

When reporting bugs, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser and OS information
- Language (EN/AR) if relevant

## 💡 Feature Requests

When suggesting features:

- Clear use case
- How it benefits users
- Possible implementation approach
- Mockups/examples if applicable

## 📞 Questions?

- Open an issue with the `question` label
- Check existing issues first
- Be specific and provide context

---

Thank you for contributing to LuxeDrive! 🚗✨
