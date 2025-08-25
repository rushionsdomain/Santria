# Santria - A Digital Health Patient Appointment System

The complete backend API for managing patient appointments in a healthcare facility. Built with Node.js, Express, and following MVC architecture patterns.

## 🚀 Features

- **Patient Management**: Register, view, update, and search patients
- **Appointment Scheduling**: Book, manage, and track appointments
- **Real-time Dashboard**: Comprehensive statistics and analytics
- **Validation**: Input validation and error handling
- **In-Memory Database**: Fast setup with sample data
- **RESTful API**: Clean, intuitive endpoints

## 🏗️ Architecture

```
├── models/          # Data models and business logic
├── controllers/     # Request handlers and business logic
├── routes/          # API route definitions
├── scripts/         # Database seeding and utilities
├── server.js        # Main application entry point
└── package.json     # Dependencies and scripts
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd digital-health-appointment-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

The server will start on `http://localhost:3000`

## 🔌 API Endpoints

### Health Check

- `GET /health` - Server status

### Patients

#### Get All Patients

```http
GET /api/patients?search=john
```

**Query Parameters:**

- `search` (optional): Search by name or ID

#### Get Patient by ID

```http
GET /api/patients/:id
```

#### Create Patient

```http
POST /api/patients
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1985-03-15",
  "gender": "Male",
  "phoneNumber": "+1-555-0123",
  "email": "john.doe@email.com",
  "address": "123 Main St, Anytown, USA",
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1-555-0124"
  },
  "medicalHistory": ["Hypertension"],
  "insuranceProvider": "Blue Cross Blue Shield",
  "insuranceNumber": "BCBS123456789"
}
```

#### Update Patient

```http
PUT /api/patients/:id
Content-Type: application/json

{
  "phoneNumber": "+1-555-9999",
  "address": "456 New Address, City, USA"
}
```

#### Delete Patient

```http
DELETE /api/patients/:id
```

### Appointments

#### Get All Appointments

```http
GET /api/appointments?date=2024-01-15&status=confirmed&patientId=123
```

**Query Parameters:**

- `date` (optional): Filter by appointment date
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `patientId` (optional): Filter by patient ID

#### Get Appointment by ID

```http
GET /api/appointments/:id
```

#### Create Appointment

```http
POST /api/appointments
Content-Type: application/json

{
  "patientId": "123",
  "doctorName": "Dr. Emily Smith",
  "specialty": "Cardiology",
  "appointmentDate": "2024-01-20",
  "appointmentTime": "09:00",
  "duration": 30,
  "type": "consultation",
  "notes": "Follow-up appointment",
  "symptoms": ["Chest pain"]
}
```

#### Update Appointment

```http
PUT /api/appointments/:id
Content-Type: application/json

{
  "appointmentTime": "10:00",
  "notes": "Updated appointment notes"
}
```

#### Update Appointment Status

```http
PATCH /api/appointments/:id/status
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Appointment confirmed"
}
```

#### Cancel Appointment

```http
DELETE /api/appointments/:id
```

### Dashboard

#### Get Daily Statistics

```http
GET /api/dashboard/stats?date=2024-01-15
```

#### Get Weekly Statistics

```http
GET /api/dashboard/weekly?startDate=2024-01-15
```

#### Get Monthly Statistics

```http
GET /api/dashboard/monthly?year=2024&month=1
```

## 📊 Data Models

### Patient

```javascript
{
  id: "uuid",
  firstName: "string",
  lastName: "string",
  dateOfBirth: "YYYY-MM-DD",
  gender: "Male|Female|Other",
  phoneNumber: "string",
  email: "string",
  address: "string",
  emergencyContact: {
    name: "string",
    relationship: "string",
    phone: "string"
  },
  medicalHistory: ["string"],
  insuranceProvider: "string",
  insuranceNumber: "string",
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

### Appointment

```javascript
{
  id: "uuid",
  patientId: "uuid",
  patientName: "string",
  doctorName: "string",
  specialty: "string",
  appointmentDate: "YYYY-MM-DD",
  appointmentTime: "HH:MM",
  duration: "number (minutes)",
  status: "pending|confirmed|completed|cancelled",
  type: "consultation|examination|follow-up|emergency|routine",
  notes: "string",
  symptoms: ["string"],
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

## 🔒 Validation Rules

### Patient Validation

- First/Last name: 2-50 characters, letters only
- Date of birth: Valid date, reasonable age (0-120 years)
- Email: Valid email format, unique
- Phone: Valid phone number format
- Address: 10-200 characters

### Appointment Validation

- Patient ID: Valid UUID
- Doctor name: Must start with "Dr."
- Date: Future date only
- Time: 8:00 AM - 6:00 PM
- Duration: 15-120 minutes
- Status: Predefined values only

## 🧪 Testing the API

### Using cURL

1. **Get all patients**

   ```bash
   curl http://localhost:3000/api/patients
   ```

2. **Create a new patient**

   ```bash
   curl -X POST http://localhost:3000/api/patients \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Test",
       "lastName": "Patient",
       "dateOfBirth": "1990-01-01",
       "gender": "Male",
       "phoneNumber": "+1-555-0000",
       "email": "test@example.com",
       "address": "123 Test St, Test City, USA",
       "emergencyContact": {
         "name": "Emergency Contact",
         "relationship": "Friend",
         "phone": "+1-555-0001"
       }
     }'
   ```

3. **Get dashboard stats**
   ```bash
   curl http://localhost:3000/api/dashboard/stats
   ```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Digital Health API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/health"
      }
    },
    {
      "name": "Get All Patients",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/patients"
      }
    },
    {
      "name": "Create Patient",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/patients",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"Test\",\n  \"lastName\": \"Patient\",\n  \"dateOfBirth\": \"1990-01-01\",\n  \"gender\": \"Male\",\n  \"phoneNumber\": \"+1-555-0000\",\n  \"email\": \"test@example.com\",\n  \"address\": \"123 Test St, Test City, USA\",\n  \"emergencyContact\": {\n    \"name\": \"Emergency Contact\",\n    \"relationship\": \"Friend\",\n    \"phone\": \"+1-555-0001\"\n  }\n}"
        }
      }
    }
  ]
}
```

## 📈 Sample Data

The system comes with pre-loaded sample data:

- **8 Patients** with complete medical profiles
- **11 Appointments** across different specialties
- **Multiple doctors** in various medical fields
- **Realistic medical conditions** and symptoms

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "errors": [] // Validation errors if applicable
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Configuration

### Environment Variables

```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
```

### Available Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Populate database with sample data
npm test         # Run tests (when implemented)
```

## 🏥 Medical Specialties

The system supports the following medical specialties:

- Cardiology
- Pulmonology
- Endocrinology
- Neurology
- Orthopedics
- Dermatology
- General Medicine
- Pediatrics
- Gynecology
- Oncology

## 🔮 Future Enhancements

- **Database Integration**: MongoDB/PostgreSQL support
- **Authentication**: JWT-based user authentication
- **File Uploads**: Medical document management
- **Notifications**: Email/SMS reminders
- **Reporting**: Advanced analytics and reports
- **Mobile API**: Optimized for mobile applications

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
