import { Controller, Get, Header } from '@nestjs/common';

@Controller('privacy')
export class PrivacyController {
  @Get()
  @Header('Content-Type', 'text/html')
  getPrivacyPolicy(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Privacy Policy — CarMarket365</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; background: #fff; line-height: 1.7; padding: 24px; max-width: 720px; margin: 0 auto; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    .updated { color: #717182; font-size: 14px; margin-bottom: 32px; }
    h2 { font-size: 20px; margin-top: 32px; margin-bottom: 8px; }
    p, li { font-size: 15px; margin-bottom: 12px; }
    ul { padding-left: 24px; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p class="updated">Last updated: May 23, 2026</p>

  <p>CarMarket365 ("we", "us", or "our") operates the CarMarket365 mobile application (the "App"). This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our App.</p>

  <h2>1. Information We Collect</h2>
  <p>We collect the following categories of personal data, along with how each is collected:</p>
  <ul>
    <li><strong>Account Information:</strong> When you register (via email or Google Sign-In), we collect your name, email address, and phone number. This data is provided directly by you or retrieved from your Google account with your consent.</li>
    <li><strong>Profile Information:</strong> You may optionally upload a profile photo using your device camera or photo library.</li>
    <li><strong>Listing Data:</strong> When you post a car for sale, you provide vehicle details including make, model, year, price, mileage, fuel type, transmission, condition, description, photos, and location. Photos are uploaded from your device camera or photo library.</li>
    <li><strong>Location Data:</strong> With your explicit permission (via the operating system permission prompt), we collect your approximate location to show nearby car listings. You can revoke this at any time in your device settings.</li>
    <li><strong>Device Information:</strong> We collect your device's push notification token (Expo Push Token) automatically when you grant notification permissions, to send you relevant notifications about your listings and inquiries.</li>
    <li><strong>Usage Data:</strong> We collect basic usage data such as listing view counts and favorite counts to help sellers understand interest in their listings. We do not use analytics SDKs or tracking pixels.</li>
  </ul>
  <p>We do not collect data from any source other than directly from you and your device. We do not purchase data from third-party data brokers.</p>

  <h2>2. How We Use Your Information</h2>
  <ul>
    <li>To create and manage your account</li>
    <li>To display your car listings to potential buyers</li>
    <li>To enable communication between buyers and sellers via inquiries</li>
    <li>To send push notifications about your listings (e.g., expiry reminders, new inquiries)</li>
    <li>To show you car listings near your location</li>
    <li>To improve and maintain the App</li>
  </ul>

  <h2>3. Data Storage and Security</h2>
  <p>We take the security of your data seriously and implement the following measures:</p>
  <ul>
    <li><strong>Encryption in transit:</strong> All data transfers between the App and our servers use HTTPS/TLS encryption.</li>
    <li><strong>Encryption at rest:</strong> Images are stored on Amazon Web Services (AWS S3) with server-side encryption (SSE-S3).</li>
    <li><strong>Authentication:</strong> User sessions are protected with JSON Web Tokens (JWT) with secure token rotation.</li>
    <li><strong>Secure credentials:</strong> Sensitive credentials (tokens, passwords) are stored using platform-native secure storage (iOS Keychain / Android Keystore via Expo SecureStore).</li>
    <li><strong>Access control:</strong> Users can only modify or delete their own listings and profile data. Server-side authorization checks enforce this.</li>
    <li><strong>Password hashing:</strong> Passwords are hashed using bcrypt and never stored in plain text.</li>
  </ul>

  <h2>4. Data Sharing</h2>
  <p>We do not sell your personal information. We share data only in these cases:</p>
  <ul>
    <li><strong>Public Listings:</strong> Car listing details (vehicle info, photos, general location) are visible to all App users.</li>
    <li><strong>Seller Contact Info:</strong> Your phone number is shared with buyers who inquire about your listing.</li>
    <li><strong>Service Providers:</strong> We use third-party services for hosting (Railway), image storage (AWS), push notifications (Expo), and authentication (Google Sign-In).</li>
  </ul>

  <h2>5. Third-Party Services</h2>
  <p>The App uses the following third-party services to operate. Each provider is contractually or by policy obligated to protect your data to at least the same standard described in this Privacy Policy:</p>
  <ul>
    <li><a href="https://policies.google.com/privacy" target="_blank">Google Sign-In</a> — for authentication. We receive only your name, email, and profile photo from Google. We do not access your Google contacts, calendar, or other Google data.</li>
    <li><a href="https://aws.amazon.com/privacy/" target="_blank">Amazon Web Services (AWS)</a> — for image storage. Only listing photos and profile photos are stored on AWS. AWS does not have access to your account data.</li>
    <li><a href="https://expo.dev/privacy" target="_blank">Expo (Push Notifications)</a> — for delivering push notifications. Expo receives only your device's push token and notification content. Expo does not receive your personal information.</li>
    <li><a href="https://railway.com/legal/privacy" target="_blank">Railway</a> — for application hosting and database. All data is processed and stored within Railway's secure infrastructure.</li>
  </ul>
  <p>We do not share your data with advertisers, data brokers, or any parties not listed above. We do not use your data for AI/ML training purposes.</p>

  <h2>6. Data Retention and Deletion</h2>
  <p>We retain your data according to the following schedule:</p>
  <ul>
    <li><strong>Account data:</strong> Retained for as long as your account is active. When you delete your account, all personal data (name, email, phone, profile photo) is permanently deleted within 30 days.</li>
    <li><strong>Car listings:</strong> Listings expire automatically after 30 days unless renewed by the seller. When a listing expires or is deleted, all associated images are permanently removed from our storage servers (AWS S3).</li>
    <li><strong>Inquiry messages:</strong> Retained as long as the associated listing exists. Deleted when the listing is removed.</li>
    <li><strong>Push tokens:</strong> Removed when you log out or delete your account.</li>
  </ul>

  <h2>7. Your Rights and Account Deletion</h2>
  <p>You have the right to:</p>
  <ul>
    <li><strong>Access</strong> your personal information through your profile in the App</li>
    <li><strong>Update</strong> your name, phone number, and profile photo at any time through the App</li>
    <li><strong>Delete your account</strong> and all associated data directly within the App (Profile &gt; Delete Account). This action is permanent and cannot be undone. All your listings, images, and personal data will be permanently removed.</li>
    <li><strong>Opt out</strong> of push notifications through your device settings (Settings &gt; Notifications &gt; CarMarket365)</li>
    <li><strong>Revoke permissions</strong> for location and camera/photo access at any time through your device settings</li>
    <li><strong>Request data export</strong> by contacting us at the email below</li>
  </ul>
  <p>You do not need to create an account to browse car listings. Account creation is only required to post listings, save favorites, or contact sellers.</p>

  <h2>8. Children's Privacy</h2>
  <p>The App is not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal data from a child under 16, we will take steps to delete that information promptly. If you believe a child has provided us with personal data, please contact us at the email below.</p>

  <h2>9. International Data Transfers</h2>
  <p>Your data may be transferred to and processed in countries other than your own. Our servers are hosted on Railway and AWS infrastructure located in the EU (Stockholm, Sweden). By using the App, you consent to the transfer of your data to these locations, where data protection laws may differ from those in your jurisdiction.</p>

  <h2>10. Legal Basis for Processing (EEA/UK Users)</h2>
  <p>If you are located in the European Economic Area or the United Kingdom, our legal basis for collecting and using your personal data depends on the context:</p>
  <ul>
    <li><strong>Contract performance:</strong> Processing necessary to provide the App's services (account management, listing creation, inquiries).</li>
    <li><strong>Consent:</strong> Location data, push notifications, and camera/photo access — you can withdraw consent at any time via device settings.</li>
    <li><strong>Legitimate interest:</strong> Improving the App, preventing fraud, and ensuring security.</li>
  </ul>

  <h2>11. Changes to This Policy</h2>
  <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting a notice in the App and updating the "Last updated" date at the top. Your continued use of the App after changes constitutes acceptance of the revised policy.</p>

  <h2>12. Contact Us</h2>
  <p>If you have any questions about this Privacy Policy, wish to exercise your data rights, or need to report a privacy concern, please contact us at:</p>
  <p><strong>Email:</strong> <a href="mailto:support@carmarket365.com">support@carmarket365.com</a></p>
</body>
</html>`;
  }
}
