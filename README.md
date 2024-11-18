# AI-Data-Extraction-Agent
This application enables users to send personalized emails using data from a Google Sheet or CSV file. It features email account integration, customizable prompts, email scheduling, real-time tracking, and analytics.

# Features
1. Data Connection
Connect to a Google Sheet or upload a CSV file to import recipient data with columns like Company Name, Email, and Location.
Auto-detects and maps columns for dynamic email customization.
2. Email Integration
Supports connecting email accounts using OAuth2 (e.g., Gmail, Outlook).
Compatible with popular Email Service Providers (ESPs) like SendGrid, Mailgun, and Amazon SES.
3. Email Personalization and Sending
Accepts a customizable prompt with placeholders (e.g., {Company Name}, {Location}).
Uses LLM APIs (e.g., OpenAI GPT) to generate personalized email content.
Sends emails individually or in batches.
4. Scheduling and Throttling
Schedule emails for specific times or intervals (e.g., 50 emails/hour).
Configurable throttling to stay within email service limits.
5. Delivery Tracking and Real-Time Analytics
Tracks delivery statuses: Delivered, Opened, Bounced, and Failed.
Provides real-time analytics for emails sent, scheduled, or failed.
6. Real-Time Dashboard
Displays detailed email statuses and progress in an intuitive dashboard.
Real-time updates using WebSocket or polling mechanisms.

# Tech Stack
Backend
Python: Core backend logic.
Flask/Django/FastAPI: Framework for APIs and business logic.
Celery: For managing email scheduling and background tasks.

Frontend
Streamlit/React.js: For building the dashboard.

Email Service Providers (ESP)
SendGrid, Amazon SES, or Mailgun: For email delivery and tracking.

Database
PostgreSQL/MySQL/SQLite: To store email metadata and scheduling information.

# Setup Instructions
1. Clone the Repository
git clone https://github.com/yourusername/custom-email-sender.git  
cd custom-email-sender  

2. Set Up a Virtual Environment
python -m venv env  
source env/bin/activate  # On Windows: env\Scripts\activate  

3. Install Dependencies
pip install -r requirements.txt  

4. Configure Environment Variables
Create a .env file in the root directory and add the following:
OPENAI_API_KEY=your_openai_api_key  
SENDGRID_API_KEY=your_sendgrid_api_key  # Or API key for Mailgun/Amazon SES  
GOOGLE_API_CREDENTIALS=path_to_your_google_api_credentials.json  
SMTP_SERVER=smtp.gmail.com  
SMTP_PORT=587  
EMAIL_USER=your_email@example.com  
EMAIL_PASSWORD=your_email_password  

5. Set Up the Database
python manage.py migrate  # For Django  

6. Start the Application
python app.py  # Or equivalent for the chosen framework  

7. Frontend Dashboard
Navigate to http://localhost:8501 (for Streamlit) or the configured front-end URL.

# Usage Instructions
1. Data Import
Upload a CSV file or connect to a Google Sheet.
Ensure the file contains columns like Email, Company Name, and other personalization data.
2. Customize Your Email
Input a prompt in the provided text box, using placeholders (e.g., "Hello {Company Name}, we have exciting updates for {Location}").
3. Schedule Emails
Choose a specific time or throttle email sending (e.g., 50 emails/hour).
4. Monitor Progress
View real-time updates on email status (e.g., Sent, Failed, Delivered, Opened).
Use the analytics dashboard to track delivery rates and engagement.

# Future Enhancements
Advanced email templates with rich HTML formatting.
Multi-language email support using AI translation.
Integration with additional ESPs.

#  Contributing
1.Fork the repository.
2.Create a feature branch:
git checkout -b feature-name  
3.Commit your changes:
git commit -m "Add feature-name"  
4.Push to the branch:
git push origin feature-name  
5.Submit a pull request.

