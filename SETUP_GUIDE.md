# 🚀 Quick Setup Guide - Farm Weather Advisory

## Step-by-Step Installation

### 1. Server Setup (5 minutes)

#### For XAMPP/LAMPP Users:

**Start the Server:**
```bash
sudo /opt/lampp/lampp start
```

**Verify Services:**
- Apache: http://localhost
- phpMyAdmin: http://localhost/phpmyadmin

**Stop the Server (when needed):**
```bash
sudo /opt/lampp/lampp stop
```

### 2. OpenWeatherMap API Key (3 minutes)

This is **REQUIRED** for the application to work properly.

1. **Visit:** https://openweathermap.org/api
2. **Sign Up:** Create a free account
3. **Get API Key:** 
   - Go to your account dashboard
   - Navigate to "API keys" section
   - Copy your default API key (or create a new one)
4. **Configure:**
   - Open: `/opt/lampp/htdocs/Farm_Weather/config/config.php`
   - Find line: `define('WEATHER_API_KEY', 'YOUR_API_KEY_HERE');`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Save the file

**Example:**
```php
define('WEATHER_API_KEY', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6');
```

**Note:** Free tier allows 1,000 API calls per day, which is sufficient for testing and small-scale use.

### 3. Database Configuration (Automatic)

The database is created automatically when you first access the application. However, you can verify:

**Default Settings (in `config/database.php`):**
- Host: `localhost`
- Username: `root`
- Password: `` (empty)
- Database: `farm_weather_db`

**To Change Database Credentials:**
1. Open `/opt/lampp/htdocs/Farm_Weather/config/database.php`
2. Modify these lines:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'farm_weather_db');
```

**Manual Database Setup (Optional):**
If automatic setup fails, you can manually create the database:
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import"
3. Choose file: `database_setup.sql`
4. Click "Go"

### 4. Access the Application

**Open your browser and navigate to:**
```
http://localhost/Farm_Weather/
```

**You should see:**
- The landing page with "Smart Irrigation Made Simple"
- Navigation with Login and Get Started buttons
- Features section

### 5. First-Time User Registration

1. Click **"Get Started"** or **"Register"**
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Phone (optional)
   - Password (minimum 6 characters)
   - Confirm Password
3. Click **"Create Account"**
4. You'll be automatically redirected to the dashboard

### 6. Setup Your Farm Profile

After registration, you'll see a yellow alert to set up your farm profile:

1. Click **"Set Up Profile"** button
2. Fill in the form:
   - **Farm Name:** (Optional) e.g., "Green Valley Farm"
   - **Location:** (Required) e.g., "Nairobi, Kenya" or "Kampala, Uganda"
   - **Crop Type:** (Required) Select from dropdown
   - **Soil Type:** (Required) Select from dropdown
   - **Farm Size:** (Optional) in acres
3. Click **"Save Profile"**

### 7. View Your Dashboard

Once your profile is set up, you'll see:

1. **Weather Card:**
   - Current temperature
   - Humidity
   - Wind speed
   - Rainfall

2. **Irrigation Advisory:**
   - Recommended water amount (L/m²)
   - Irrigation frequency
   - Detailed recommendations

3. **Charts:**
   - Water usage trends (last 7 days)
   - Weather conditions (last 7 days)

4. **Daily Tip:**
   - Educational irrigation tips

## 🔧 Troubleshooting

### Issue: Weather Data Not Loading

**Symptoms:**
- "Failed to fetch weather data" error
- Weather card shows error message

**Solutions:**
1. **Check API Key:**
   - Verify you've set your API key in `config/config.php`
   - Ensure there are no extra spaces or quotes
   - API key should be exactly as shown in OpenWeatherMap dashboard

2. **Check Internet Connection:**
   - Ensure your server has internet access
   - Try accessing: https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY

3. **Check API Quota:**
   - Free tier: 1,000 calls/day
   - Check your usage at: https://home.openweathermap.org/api_keys

4. **Verify Location:**
   - Use city names like "Nairobi", "Kampala", "Dar es Salaam"
   - Or use coordinates format

### Issue: Database Connection Error

**Symptoms:**
- "Connection failed" error
- Unable to register or login

**Solutions:**
1. **Verify MySQL is Running:**
   ```bash
   sudo /opt/lampp/lampp status
   ```

2. **Check Database Credentials:**
   - Open `config/database.php`
   - Verify username and password match your MySQL setup

3. **Create Database Manually:**
   - Open phpMyAdmin
   - Create database: `farm_weather_db`
   - Import `database_setup.sql`

4. **Check Permissions:**
   ```bash
   sudo chmod -R 755 /opt/lampp/htdocs/Farm_Weather
   ```

### Issue: Cannot Login After Registration

**Symptoms:**
- "Invalid email or password" error
- Registration successful but login fails

**Solutions:**
1. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear cookies and cache

2. **Check Database:**
   - Open phpMyAdmin
   - Check if user exists in `users` table
   - Verify email is correct

3. **Try Password Reset:**
   - Register with a new email
   - Or manually update password in database

### Issue: Charts Not Displaying

**Symptoms:**
- Empty or broken chart areas
- "No data available" message

**Solutions:**
1. **Wait for Data:**
   - Charts need at least one irrigation log
   - Use the system for a day to generate data

2. **Check JavaScript:**
   - Open browser console (F12)
   - Look for JavaScript errors
   - Ensure Chart.js CDN is loading

3. **Refresh Dashboard:**
   - Click refresh icon on weather card
   - This generates new irrigation log

### Issue: Permission Denied Errors

**Solutions:**
```bash
# Set proper permissions
sudo chown -R www-data:www-data /opt/lampp/htdocs/Farm_Weather
sudo chmod -R 755 /opt/lampp/htdocs/Farm_Weather

# Or for XAMPP:
sudo chown -R nobody:nogroup /opt/lampp/htdocs/Farm_Weather
```

## 📱 Testing the Application

### Test Checklist:

- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Farm profile can be created/updated
- [ ] Weather data loads (with valid API key)
- [ ] Irrigation advisory displays
- [ ] Charts render (after generating data)
- [ ] Daily tip displays
- [ ] Logout works

### Sample Test Data:

**Location Examples:**
- Nairobi, Kenya
- Kampala, Uganda
- Dar es Salaam, Tanzania
- Addis Ababa, Ethiopia
- Kigali, Rwanda

**Crop Types:**
- Maize
- Beans
- Tomatoes
- Cabbage
- Potatoes

**Soil Types:**
- Sandy
- Loamy
- Clay
- Silt

## 🔐 Security Notes

1. **Change Default Credentials:**
   - If deploying to production, change database password
   - Update `config/database.php` accordingly

2. **API Key Security:**
   - Never commit API keys to public repositories
   - Consider using environment variables for production

3. **HTTPS:**
   - For production, always use HTTPS
   - Get free SSL certificate from Let's Encrypt

## 📊 Monitoring Usage

### Check Database:
```sql
-- View registered users
SELECT id, full_name, email, created_at FROM users;

-- View farm profiles
SELECT * FROM farm_profiles;

-- View irrigation logs
SELECT * FROM irrigation_logs ORDER BY irrigation_date DESC LIMIT 10;
```

### Check API Usage:
- Visit: https://home.openweathermap.org/api_keys
- Monitor your API call count

## 🎯 Next Steps

After successful setup:

1. **Customize:**
   - Modify colors in Tailwind config
   - Add your logo
   - Customize educational tips

2. **Extend:**
   - Add more crop types
   - Implement email notifications
   - Add weather forecasts

3. **Deploy:**
   - Consider deploying to a web host
   - Use cPanel or similar hosting
   - Ensure PHP 7.4+ and MySQL support

## 📞 Need Help?

1. **Check README.md** for detailed documentation
2. **Review markdown.md** for project requirements
3. **Inspect browser console** for JavaScript errors
4. **Check PHP error logs** at `/opt/lampp/logs/error_log`

---

**Happy Farming! 🌾**
