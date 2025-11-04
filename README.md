# 🌾 Farm Weather Advisory Dashboard

A comprehensive web-based irrigation advisory system designed for small-scale farmers to optimize water usage through real-time weather data and intelligent recommendations.

## 🆕 NEW: IoT-Enhanced Smart Dashboard

**Experience the future of smart farming!** The new IoT Dashboard includes:
- 💧 **Real-time soil moisture monitoring** with visual gauges
- 🚰 **Automated pump control** (manual & automatic modes)
- 📡 **Device connectivity status** monitoring
- 📊 **Live sensor data feed** with continuous updates
- 📈 **Advanced analytics** with interactive charts
- 🔔 **Smart notifications** for critical events
- ⚙️ **Simulation controls** for testing scenarios
- 🔌 **Future-ready** for real IoT hardware integration

👉 **[View IoT Features Documentation](IOT_FEATURES.md)**

---

## 📋 Core Features

- **User Authentication**: Secure registration and login system
- **Farm Profile Management**: Personalize your experience with crop and soil information
- **Real-Time Weather Integration**: Live weather data from OpenWeatherMap API
- **Smart Irrigation Advisory**: Data-driven recommendations based on weather, crop, and soil type
- **Data Visualization**: Interactive charts showing water usage and weather trends
- **Educational Tips**: Daily irrigation best practices and tips
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🤖 IoT Dashboard**: Advanced simulation with automated control and real-time monitoring

## 🛠️ Technologies Used

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **APIs**: OpenWeatherMap API
- **Charts**: Chart.js
- **Icons**: Font Awesome

## 📦 Installation

### Prerequisites

- XAMPP, WAMP, or LAMP server
- PHP 7.4 or higher
- MySQL 5.7 or higher
- OpenWeatherMap API key (free tier available)

### Setup Instructions

1. **Clone or Download the Project**
   ```bash
   cd /opt/lampp/htdocs/
   # Project is already in Farm_Weather directory
   ```

2. **Start Your Server**
   - Start Apache and MySQL from XAMPP/LAMP control panel
   - Or use command line:
   ```bash
   sudo /opt/lampp/lampp start
   ```

3. **Configure Database**
   - The database will be created automatically on first run
   - Default credentials in `config/database.php`:
     - Host: localhost
     - User: root
     - Password: (empty)
     - Database: farm_weather_db
   
   - If you need to change these, edit `config/database.php`

4. **Get OpenWeatherMap API Key**
   - Visit: https://openweathermap.org/api
   - Sign up for a free account
   - Get your API key from the dashboard
   - Open `config/config.php` and replace:
     ```php
     define('WEATHER_API_KEY', 'YOUR_API_KEY_HERE');
     ```
     with your actual API key

5. **Access the Application**
   - Open your browser and navigate to:
   ```
   http://localhost/Farm_Weather/
   ```

## 📁 Project Structure

```
Farm_Weather/
├── config/
│   ├── config.php          # Application configuration
│   └── database.php        # Database configuration and setup
├── php/
│   ├── auth.php           # Authentication handlers
│   ├── farm_profile.php   # Farm profile management
│   ├── weather.php        # Weather API integration
│   └── irrigation_advisory.php  # Irrigation calculations
├── js/
│   └── dashboard.js       # Dashboard functionality
├── index.html             # Landing page
├── register.html          # Registration page
├── login.html            # Login page
├── dashboard.html        # Main dashboard
├── markdown.md           # Project documentation
└── README.md            # This file
```

## 🚀 Usage Guide

### 1. Registration
- Navigate to the homepage
- Click "Get Started" or "Register"
- Fill in your details (name, email, password)
- Submit the form

### 2. Setup Farm Profile
- After login, you'll be prompted to set up your farm profile
- Enter:
  - Farm name (optional)
  - Location (city name or coordinates)
  - Crop type (maize, beans, tomatoes, etc.)
  - Soil type (sandy, loamy, clay, silt)
  - Farm size in acres (optional)
- Save the profile

### 3. View Dashboard
- **Weather Card**: Shows current weather conditions for your location
- **Irrigation Advisory**: Displays recommended water amount and frequency
- **Charts**: Visualize your irrigation history and weather trends
- **Daily Tips**: Learn best practices for irrigation

### 4. Refresh Data
- Click the refresh icon on the weather card to update data
- Recommendations are automatically recalculated with new weather data

## 🧮 Irrigation Algorithm

The system calculates irrigation needs using:

1. **Base Water Requirements** (by crop type):
   - Maize: 5.0 L/m²/day
   - Beans: 4.0 L/m²/day
   - Tomatoes: 6.0 L/m²/day
   - Rice: 7.0 L/m²/day
   - etc.

2. **Soil Adjustment Factors**:
   - Sandy: 1.3× (drains quickly)
   - Loamy: 1.0× (ideal)
   - Clay: 0.8× (retains water)
   - Silt: 0.9×

3. **Weather Factors**:
   - Temperature adjustment (higher temp = more water)
   - Humidity adjustment (lower humidity = more water)
   - Rainfall deduction (reduces irrigation need)

**Formula**:
```
Recommended Water = Base Need × Soil Factor × Temp Factor × Humidity Factor - Rainfall
```

## 🔒 Security Features

- Password hashing using PHP's `password_hash()`
- SQL injection prevention with prepared statements
- Session-based authentication
- Input validation and sanitization
- CSRF protection ready

## 📊 Database Schema

### Users Table
- id (Primary Key)
- full_name
- email (Unique)
- password (Hashed)
- phone
- created_at

### Farm Profiles Table
- id (Primary Key)
- user_id (Foreign Key)
- farm_name
- location
- latitude, longitude
- crop_type
- soil_type
- farm_size
- created_at, updated_at

### Irrigation Logs Table
- id (Primary Key)
- user_id (Foreign Key)
- farm_profile_id (Foreign Key)
- irrigation_date
- water_amount
- temperature
- humidity
- rainfall
- recommendation
- created_at

## 🐛 Troubleshooting

### Weather Data Not Loading
- Check if your API key is correctly set in `config/config.php`
- Verify your internet connection
- Ensure the location name is correct
- Check API quota (free tier has limits)

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `config/database.php`
- Ensure the database user has proper permissions

### Charts Not Displaying
- Ensure Chart.js CDN is accessible
- Check browser console for JavaScript errors
- Verify irrigation logs exist in the database

### Session Issues
- Check if PHP sessions are enabled
- Verify session save path has write permissions
- Clear browser cookies and try again

## 🔄 Future Enhancements

- [ ] SMS/Email notifications for irrigation reminders
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Integration with IoT sensors
- [ ] Historical weather data analysis
- [ ] Community forum for farmers
- [ ] Export reports to PDF
- [ ] Weather forecasts (7-day predictions)

## 📚 References

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PHP Manual](https://www.php.net/manual/en/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 👨‍💻 Development

### Testing Credentials (After Registration)
Create your own account through the registration page.

### API Testing
Test the weather API directly:
```
http://localhost/Farm_Weather/php/weather.php?location=Nairobi
```

### Database Management
Access phpMyAdmin:
```
http://localhost/phpmyadmin
```

## 📄 License

This project is developed for educational purposes as part of a web development course.

## 🤝 Contributing

This is an academic project. For suggestions or improvements, please contact the project maintainer.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the project documentation
3. Contact your course instructor

---

**Built with ❤️ for small-scale farmers**
