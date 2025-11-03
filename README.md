# 📅✨ sdx-php-date TypeScript Library 🪄🌟

Simplify date handling with sdx-php-date! This TypeScript ES-Module library brings the power of PHP's date function to your JavaScript projects, with added functionalities. ✨

## 🚀 Features

- **date():** Format dates just like PHP's date function, with optional timestamp support. ⏰
- **formatDate():** Easily format JS Date objects with custom formats. 📆
- **formatDatetime():** Format datetime strings effortlessly, following PHP's date function style. ⏰📆

## 📝 Usage

```typescript
import { date, formatDate, formatDatetime } from 'sdx-php-date'

// Format current date
const formattedDate = date('Y-m-d') // Output: '2023-08-02'

// Format specific timestamp
const formattedTimestamp = date('H:i', 1627915200) // Output: '00:00'

// Format JS Date object
const jsDate = new Date('2023-08-02T12:34:56')
const formattedJSDate = formatDate('l, F jS Y', jsDate) // Output: 'Wednesday, August 2nd 2023'

// Format datetime string
const datetimeString = '2023-08-02 12:34:56'
const formattedDatetime = formatDatetime('d/m/Y h:i A', datetimeString) // Output: '02/08/2023 12:34 PM'
```

## ⚙️ Installation

To install sdx-php-date, use npm:

```
npm install sdx-php-date
```

## 🛠️ TypeScript Configuration

Make sure your TypeScript configuration includes:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES5",
    "strict": true,
    "moduleResolution": "Node",
    "sourceMap": true,
    "noEmit": true,
    "lib": ["es2017"]
  },
  "files": [
    "date.ts"
  ]
}
```

## 🎩 Contribute

Contributions are welcome! If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request. Let's make date handling magical together! 🪄✨

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Enjoy using sdx-php-date and have fun coding! 🚀💻
