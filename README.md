# Job Application Tracker

A modern React TypeScript application for tracking job applications with a clean, responsive interface built with Tailwind CSS.

## Features

- **Add New Applications**: Form to add job applications with company name, job title, date applied, status, and details
- **Edit Applications**: Inline editing modal for updating job information
- **Delete Applications**: Remove applications from the tracker
- **Status Tracking**: Track applications through different stages (Applied, Interview, Offer, Rejected)
- **Collapsible Details**: View/hide additional details for each application
- **Local Storage**: Data persists across browser sessions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Local Storage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── JobTracker.tsx    # Main application component
│   ├── JobForm.tsx       # Form for adding new applications
│   └── JobCard.tsx       # Individual job application card
├── types/
│   └── types.ts          # TypeScript interfaces
├── App.tsx               # Root component
└── main.tsx             # Application entry point
```

## Usage

1. **Adding Applications**: Use the form at the top to add new job applications
2. **Managing Applications**: Click the edit (✏️) or delete (🗑️) buttons on each card
3. **Viewing Details**: Click "View Details" to see additional information about each application
4. **Data Persistence**: All data is automatically saved to your browser's local storage

## Features in Detail

### Status Management
- **Applied**: Initial application submitted
- **Interview**: Interview scheduled or completed
- **Offer**: Job offer received
- **Rejected**: Application rejected

### Data Persistence
The application uses browser local storage to save your job applications. This means:
- Data persists across browser sessions
- No account creation required
- Data is stored locally on your device

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
