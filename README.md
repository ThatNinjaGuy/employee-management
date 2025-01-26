# Employee Management System

A comprehensive web application for managing employees, payroll, attendance, and supplier payments built with Next.js and TypeScript.

## Features

### 1. Employee Management

- Complete employee profile management
- Track employee information including personal details and employment history
- View and update employee records
- Add new employees with validation
- Delete employee records with confirmation
- Filter and search employee data
- Department-wise employee organization

### 2. Attendance Management

- Track daily employee attendance
- Record check-in and check-out times
- View attendance patterns and history
- Generate attendance reports
- Monitor late arrivals and early departures
- Monthly attendance summaries

### 3. Payroll Management

- Calculate and process employee salaries
- Handle salary components (basic, allowances, deductions)
- Generate monthly payroll reports
- Track payment history
- Automated tax calculations
- Customizable salary components
- Bulk payroll processing

### 4. Supplier Payables

- Manage supplier payment records
- Track payment history and due amounts
- Generate supplier payment reports
- View payment schedules
- Monitor outstanding payments
- Payment history tracking

### 5. Reports Dashboard

- Visual representation of key metrics
- Employee count trends
- Monthly payroll expenditure analysis
- Interactive charts and graphs
- Export data for analysis
- Comprehensive financial reporting

### 6. System Configuration

- Configure system settings
- Manage departments and roles
- Customize application preferences
- User access management
- System-wide settings control
- Department configuration

## Technical Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **State Management**: React Context API
- **Charts**: Highcharts
- **Styling**: Tailwind CSS with custom theme
- **Data Validation**: TypeScript types and interfaces

## Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── common/           # Shared components
│   ├── employees/        # Employee management components
│   ├── payroll/          # Payroll related components
│   ├── reports/          # Reporting components
│   └── suppliers/        # Supplier management components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── services/            # API service layers
├── styles/              # Global styles and themes
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
