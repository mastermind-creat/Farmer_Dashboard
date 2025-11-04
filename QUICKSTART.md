# ⚡ Quick Start Guide

## Get Started in 5 Minutes!

### Step 1: Start Your Server (1 minute)
```bash
sudo /opt/lampp/lampp start
```

### Step 2: Get API Key (2 minutes)
1. Visit: https://openweathermap.org/api
2. Sign up (free)
3. Copy your API key
4. Open: `/opt/lampp/htdocs/Farm_Weather/config/config.php`
5. Replace `YOUR_API_KEY_HERE` with your actual key

### Step 3: Access Application (30 seconds)
Open browser: http://localhost/Farm_Weather/

### Step 4: Register & Setup (1.5 minutes)
1. Click "Get Started"
2. Fill registration form
3. Setup farm profile:
   - Location: "Nairobi" (or your city)
   - Crop: Select from dropdown
   - Soil: Select from dropdown
4. View your dashboard!

## 🎯 What You'll See

- **Real-time weather** for your location
- **Irrigation recommendations** (water amount & frequency)
- **Charts** showing trends (after a few days of use)
- **Daily tips** for better irrigation

## ⚠️ Important Notes

1. **API Key is Required** - Weather won't work without it
2. **MySQL Must Be Running** - Check XAMPP control panel
3. **First Time Setup** - Database creates automatically
4. **Internet Required** - For weather API calls

## 🆘 Quick Troubleshooting

**Weather not loading?**
→ Check API key in `config/config.php`

**Can't login?**
→ Ensure MySQL is running

**Page not found?**
→ Verify URL: `http://localhost/Farm_Weather/`

## 📚 Need More Help?

- **Full Setup**: See `SETUP_GUIDE.md`
- **Documentation**: See `README.md`
- **Technical Details**: See `PROJECT_DOCUMENTATION.md`

---

**Ready? Start your server and go to:** http://localhost/Farm_Weather/
