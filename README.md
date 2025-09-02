# Santria - A Complete Digital Health Patient Appointment System

A comprehensive full-stack healthcare management system with a modern React frontend and robust Node.js backend, featuring PostgreSQL database integration with Prisma ORM.

## 🚀 Complete System Features

### Backend (Node.js + Express + Prisma + PostgreSQL)

- **Patient Management**: Complete CRUD operations with validation
- **Appointment Scheduling**: Advanced booking system with availability checks
- **Real-time Dashboard**: Comprehensive analytics and statistics
- **Database Integration**: PostgreSQL with Prisma ORM (with in-memory fallback)
- **RESTful API**: Clean, documented endpoints with proper error handling
- **Data Validation**: Comprehensive input validation and sanitization
- **Sample Data**: Pre-loaded with realistic healthcare data

### Frontend (React + Material UI)

- **Modern UI**: Beautiful, responsive design with blue/white healthcare theme
- **Dashboard**: Interactive charts and real-time statistics
- **Patient Management**: Complete patient registration and management
- **Appointment Calendar**: Visual calendar with drag-and-drop functionality
- **Mobile Responsive**: Optimized for all device sizes
- **3D Visual Elements**: Enhanced dashboard with gradient effects and animations

## 🏗️ System Architecture

```
├── Backend/
│   ├── models/          # Prisma models + DataStore fallback
│   ├── controllers/     # Business logic handlers
│   ├── routes/          # API route definitions
│   ├── prisma/          # Database schema and migrations
│   ├── scripts/         # Database seeding utilities
│   └── server.js        # Main application entry point
├── santria-frontend/    # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   ├── api/         # Backend integration
│   │   └── theme.js     # Material UI theme
│   └── public/          # Static assets
└── README.md           # This file
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone and Setup Backend

```bash
git clone <repository-url>
cd digital-health-appointment-system
npm install
```

### 2. Database Setup

```bash
# Create .env file with your PostgreSQL connection
echo 'DATABASE_URL=postgresql://username:password@localhost:5432/clinic_db' > .env

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run seed
```

### 3. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend runs on `http://localhost:3000`

### 4. Setup Frontend

```bash
cd santria-frontend
npm install
npm start
```

Frontend runs on `http://localhost:3001`

## 🔌 Complete API Documentation

### Health Check

- `GET /health` - Server status

### Patient Management

- `GET /api/patients` - List all patients (with search)
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Register new patient
- `PUT /api/patients/:id` - Update patient information
- `DELETE /api/patients/:id` - Remove patient

### Appointment Management

- `GET /api/appointments` - List appointments (with filters)
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment

### Dashboard Analytics

- `GET /api/dashboard/stats` - Daily statistics
- `GET /api/dashboard/weekly` - Weekly trends
- `GET /api/dashboard/monthly` - Monthly analytics

## 🎨 Frontend Features

### Dashboard Page

- **Real-time Statistics**: Today's appointments, completion rates
- **Interactive Charts**: Pie charts, line graphs, bar charts
- **3D Visual Elements**: Gradient cards, hover effects, animations
- **Performance Metrics**: Completion rates, pending reviews
- **Quick Actions**: Direct links to patient and appointment management

### Patient Management

- **Patient List**: Searchable table with all patient information
- **Registration Form**: Complete patient registration with validation
- **Patient Details**: Individual patient view with appointment history
- **Mobile Responsive**: Optimized for mobile devices

### Appointment Management

- **Appointment List**: Filterable by date, status, patient
- **Booking Form**: Complete appointment scheduling
- **Status Management**: Update appointment statuses
- **Calendar View**: Visual calendar with appointment display

### Calendar View

- **Monthly Calendar**: Interactive calendar grid
- **Appointment Display**: Color-coded appointment chips
- **Date Navigation**: Month-by-month navigation
- **Appointment Details**: Click to view/edit appointments
- **Mobile Optimized**: Responsive design for all screen sizes

## 📊 Database Schema

### Patient Model

```prisma
model Patient {
  id                String   @id @default(uuid())
  firstName         String
  lastName          String
  dateOfBirth       DateTime
  gender            String
  phoneNumber       String
  email             String   @unique
  address           String
  emergencyContact  Json
  medicalHistory    String[]
  insuranceProvider String?
  insuranceNumber   String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  appointments      Appointment[]
}
```

### Appointment Model

```prisma
model Appointment {
  id              String   @id @default(uuid())
  patientId       String
  patientName     String
  doctorName      String
  specialty       String
  appointmentDate DateTime
  appointmentTime String
  duration        Int
  status          String
  type            String?
  notes           String?
  symptoms        String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  patient         Patient  @relation(fields: [patientId], references: [id])
}
```

## 🎯 Key Features Implemented

### ✅ Completed Features

1. **Backend Infrastructure**

   - ✅ Node.js + Express server running on port 5000
   - ✅ Prisma ORM with PostgreSQL database integration
   - ✅ In-memory DataStore fallback for development
   - ✅ Complete CRUD operations for patients and appointments
   - ✅ Comprehensive input validation and error handling
   - ✅ RESTful API design with proper HTTP status codes
   - ✅ Health check endpoint for monitoring

2. **Database Integration**

   - ✅ PostgreSQL schema with Prisma ORM
   - ✅ Database migrations and seeding
   - ✅ Sample data with realistic healthcare information
   - ✅ Relationship management between patients and appointments
   - ✅ Database service layer with fallback support

3. **Frontend Application**

   - ✅ React 18 with Material UI v7
   - ✅ Fully responsive design for all device sizes
   - ✅ Interactive dashboard with real-time charts
   - ✅ Complete patient management system
   - ✅ Advanced appointment scheduling with calendar view
   - ✅ Mobile-optimized navigation with collapsible sidebar
   - ✅ 3D visual elements and modern UI design

4. **Advanced Features**

   - ✅ 3D visual elements with gradient effects and animations
   - ✅ Interactive charts using Recharts library
   - ✅ Real-time data updates from backend API
   - ✅ Comprehensive form validation with error messages
   - ✅ Loading states and error handling
   - ✅ Full-screen calendar view with appointment management
   - ✅ Mobile-responsive design with touch-friendly interface

5. **System Integration**
   - ✅ Frontend-backend communication via REST API
   - ✅ Environment-based configuration
   - ✅ Cross-origin resource sharing (CORS) support
   - ✅ Security headers with Helmet middleware
   - ✅ Request logging with Morgan
   - ✅ Graceful error handling and user feedback

## 🚀 Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm run seed       # Seed database with sample data
npm run db:generate # Generate Prisma client
npm run db:migrate  # Run database migrations
npm run db:push     # Push schema to database
npm run db:studio   # Open Prisma Studio
npm run db:reset    # Reset database
```

### Frontend Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/clinic_db
PORT=3000
NODE_ENV=development
```

**Frontend (.env)**

```bash
REACT_APP_API_BASE_URL=http://localhost:5000
```

## 📱 Mobile Responsiveness

The entire application is fully responsive with:

- **Mobile Navigation**: Collapsible sidebar with hamburger menu
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Touch-Friendly**: Optimized for touch interactions
- **Mobile Calendar**: Compact calendar view for mobile devices
- **Responsive Charts**: Charts that adapt to screen size

## 🎨 Design Features

### 3D Visual Elements

- **Gradient Backgrounds**: Beautiful gradient overlays
- **Hover Effects**: Interactive card animations
- **Shadow Effects**: Depth and dimension
- **Color Transitions**: Smooth color animations
- **Glass Morphism**: Modern glass-like effects

### Color Scheme

- **Primary**: Blue (#1976d2)
- **Secondary**: Light Blue (#42a5f5)
- **Success**: Green (#66bb6a)
- **Warning**: Orange (#ff9800)
- **Error**: Red (#ef5350)

## 🧪 Testing

### API Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Get all patients
curl http://localhost:3000/api/patients

# Create patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","dateOfBirth":"1990-01-01","gender":"Male","phoneNumber":"+1-555-0000","email":"john@example.com","address":"123 Main St"}'

# Get dashboard stats
curl http://localhost:3000/api/dashboard/stats
```

## 🚀 Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run db:migrate`
4. Seed data: `npm run seed`
5. Start server: `npm start`

### Frontend Deployment (Vercel)

1. Build the project: `npm run build`
2. Deploy to Vercel
3. Set environment variables in Vercel dashboard
4. Configure API base URL

## 🔮 Future Enhancements

- **Authentication**: JWT-based user authentication
- **File Uploads**: Medical document management
- **Notifications**: Email/SMS reminders
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Offline Support**: Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation
- Review the sample data and validation rules

---

**Built with ❤️ for the healthcare community**

_Santria - Transforming healthcare management through technology_
