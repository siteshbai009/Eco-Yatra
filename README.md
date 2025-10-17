<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Team Nexus — Grievance Redressal Portal — README</title>
  <style>
    :root{
      --bg:#0f1724; --card:#0b1220; --muted:#9aa4b2; --accent:#4f46e5; --accent-2:#06b6d4; --glass: rgba(255,255,255,0.03);
      --mono: 'SFMono-Regular', Consolas, 'Roboto Mono', Menlo, monospace;
    }
    html,body{height:100%;margin:0;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: linear-gradient(180deg,#071126 0%, #041021 100%); color:#e6eef6}
    .wrap{max-width:1100px;margin:36px auto;padding:28px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border-radius:12px;box-shadow:0 8px 30px rgba(2,6,23,0.6);}
    header{display:flex;gap:18px;align-items:center}
    .logo{width:84px;height:84px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;color:white;box-shadow:0 6px 18px rgba(79,70,229,0.18)}
    h1{margin:0;font-size:28px}
    p.lead{margin:6px 0 18px;color:var(--muted)}
    .badges{display:flex;gap:8px;flex-wrap:wrap}
    .badge{background:var(--glass);padding:6px 10px;border-radius:999px;font-size:13px;color:var(--muted);}

    nav.toc{margin:18px 0;padding:12px;background:rgba(255,255,255,0.012);border-radius:10px}
    nav.toc ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:10px}
    nav.toc a{color:var(--accent);text-decoration:none}

    section{margin-top:22px}
    h2{font-size:20px;margin:12px 0}
    h3{font-size:16px;margin:10px 0;color:#d5e0f0}
    pre{background:#071226;border:1px solid rgba(255,255,255,0.03);padding:14px;border-radius:8px;overflow:auto;color:#dff6ff;font-family:var(--mono);font-size:13px}
    code{background:rgba(255,255,255,0.02);padding:2px 6px;border-radius:6px;font-family:var(--mono);font-size:13px}
    .grid{display:grid;grid-template-columns:1fr 320px;gap:18px}
    .card{background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.02)}
    .muted{color:var(--muted);font-size:14px}
    ul.check{padding-left:18px}
    footer{margin-top:26px;padding-top:16px;border-top:1px dashed rgba(255,255,255,0.03);display:flex;justify-content:space-between;align-items:center}
    .cta{background:linear-gradient(90deg,var(--accent),var(--accent-2));padding:10px 14px;border-radius:10px;color:white;text-decoration:none}
    .screenshot{width:100%;height:220px;background:#061126;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--muted);}
    .faq dt{font-weight:600;margin-top:10px}
    .faq dd{margin:6px 0 12px;color:var(--muted)}
    @media (max-width:980px){.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="logo">TN</div>
      <div>
        <h1>Team Nexus — Grievance Redressal Portal</h1>
        <p class="lead">A complete Expo / React Native app to submit, track and resolve institutional grievances. Built with accessibility, security, and clarity in mind.</p>
        <div class="badges">
          <span class="badge">React Native</span>
          <span class="badge">Expo</span>
          <span class="badge">Android • iOS</span>
          <span class="badge">MIT</span>
          <span class="badge">Team Nexus</span>
        </div>
      </div>
    </header>

    <nav class="toc">
      <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#development">Development</a></li>
        <li><a href="#builds">Building & Releases</a></li>
        <li><a href="#playstore">Play Store</a></li>
        <li><a href="#appstore">App Store</a></li>
        <li><a href="#optimization">Size Optimization</a></li>
        <li><a href="#github">GitHub</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contribute">Contribute</a></li>
      </ul>
    </nav>

    <div class="grid">
      <main>
        <section id="overview" class="card">
          <h2>Overview</h2>
          <p class="muted">This repository contains the source code for the <strong>Team Nexus — Grievance Redressal Portal</strong>. The app allows users (students, faculty, staff) to submit grievances, attach evidence (images, documents), track resolution status, and receive notifications. Admins can manage tickets, assign to departments, and maintain SLA-based workflows.</p>
        </section>

        <section id="features" class="card">
          <h2>Features</h2>
          <ul class="check">
            <li>Secure authentication (email/password, optional SSO)</li>
            <li>Submit grievances with categories, priority, and attachments</li>
            <li>Real-time status updates and push notifications</li>
            <li>Admin dashboard with filtering, search, and assignment</li>
            <li>Anonymous submissions (configurable)</li>
            <li>Audit logs and export (CSV)</li>
            <li>Role-based access control (student, faculty, admin)</li>
          </ul>
        </section>

        <section id="installation" class="card">
          <h2>Installation</h2>
          <h3>Prerequisites</h3>
          <ul>
            <li>Node.js (LTS)</li>
            <li>npm or yarn</li>
            <li>Expo CLI (optional but recommended)</li>
            <li>Android Studio (for emulator) / Xcode (for iOS on Mac)</li>
          </ul>

          <h3>Install dependencies</h3>
          <pre><code>npm install
# or
yarn install</code></pre>

          <h3>Start dev server</h3>
          <pre><code>npx expo start</code></pre>

          <p class="muted">Open the project in <code>Expo Go</code>, Android emulator or iOS simulator. For production-ready features (native modules), use a development build or bare workflow.</p>
        </section>

        <section id="development" class="card">
          <h2>Development</h2>
          <h3>Project structure</h3>
          <pre><code>app/
  ┣ screens/
  ┣ components/
  ┣ navigation/
  ┣ services/   # API & auth
  ┣ assets/
  package.json
  app.json
  README.md</code></pre>

          <h3>Useful scripts</h3>
          <pre><code>npm start         # start expo
npm run android     # build & run on android dev build
npm run ios         # build & run on ios (mac only)
npm run lint        # run linter
npm run test        # run unit tests (if configured)</code></pre>

          <h3>Environment variables</h3>
          <p class="muted">Create a <code>.env</code> file (DO NOT commit it). Example:</p>
          <pre><code>API_URL=https://api.giet.example
FIREBASE_API_KEY=...
SENTRY_DSN=
APP_ENV=development</code></pre>
        </section>

        <section id="builds" class="card">
          <h2>Building & Releases</h2>
          <h3>Expo (managed) — App Bundle (recommended)</h3>
          <pre><code>eas build -p android --profile release --type app-bundle
# iOS
eas build -p ios --profile release</code></pre>

          <h3>React Native (bare) — Android release</h3>
          <pre><code>cd android
./gradlew assembleRelease
# output: android/app/build/outputs/apk/release/app-release.apk</code></pre>

          <h3>Signing</h3>
          <p class="muted">For Play Store, use Google Play App Signing (recommended). For iOS, ensure correct provisioning profiles and certificates in App Store Connect/Xcode.</p>
        </section>

        <section id="playstore" class="card">
          <h2>Publishing to Google Play Store</h2>
          <ol>
            <li>Register a Google Play Developer account ($25 one-time).</li>
            <li>Create a new app in Play Console and fill store listing (icon, screenshots, description).</li>
            <li>Upload the <code>.aab</code> under Production &amp; create a release.</li>
            <li>Set content rating, target audience, and privacy policy link.</li>
            <li>Review and publish. Review usually completes in 1–3 days.</li>
          </ol>

          <h3>Play Store checklist</h3>
          <ul>
            <li>VersionCode &amp; versionName updated</li>
            <li>Keystore backup stored securely</li>
            <li>Privacy policy URL present</li>
            <li>Release notes included</li>
          </ul>
        </section>

        <section id="appstore" class="card">
          <h2>Publishing to Apple App Store</h2>
          <ol>
            <li>Enroll in Apple Developer Program ($99/year).</li>
            <li>Create app record on App Store Connect.</li>
            <li>Upload build via Transporter or EAS Submit.</li>
            <li>Fill metadata, screenshots, and privacy information.</li>
            <li>Submit for review and wait for approval (1–3 days typically).</li>
          </ol>

          <p class="muted">Tip: Use TestFlight to test builds with internal/external testers before public release.</p>
        </section>

        <section id="optimization" class="card">
          <h2>Size Optimization &amp; Performance</h2>
          <h3>Key strategies</h3>
          <ul>
            <li>Use <code>--type app-bundle</code> and let Play Store do device-specific splits</li>
            <li>Enable ProGuard and resource shrinking for bare apps</li>
            <li>Remove unused packages and large assets</li>
            <li>Convert images to WebP and compress assets</li>
            <li>Replace heavy libs (moment.js → dayjs)</li>
            <li>Lazy-load heavy screens and code-split where possible</li>
          </ul>

          <h3>Proguard example (android/app/build.gradle)</h3>
          <pre><code>buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
  }
}</code></pre>
        </section>

        <section id="github" class="card">
          <h2>Pushing to GitHub</h2>
          <p class="muted">You already created the repo <code>https://github.com/TEAMNEXUS-giet/grievance-redressal-portal.git</code>. Use the following commands from your project root:</p>
          <pre><code>git init
git add .
git commit -m "Initial commit - Team Nexus"
git remote add origin https://github.com/TEAMNEXUS-giet/grievance-redressal-portal.git
git branch -M main
git push -u origin main</code></pre>

          <h3>Recommended .gitignore</h3>
          <pre><code>node_modules/
.expo/
.env
.DS_Store
android/.gradle
android/app/build
ios/Pods
*.log</code></pre>
        </section>

        <section id="ci" class="card">
          <h2>Continuous Integration (optional)</h2>
          <p class="muted">Add a GitHub Actions workflow to run linting, tests and build validation on push/PR.</p>
          <pre><code>name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with: node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test</code></pre>
        </section>

        <section id="faq" class="card">
          <h2>FAQ</h2>
          <dl class="faq">
            <dt>Who can use this portal?</dt>
            <dd>Students, faculty, and staff of the institution (configurable by deployment).</dd>
            <dt>Is my complaint confidential?</dt>
            <dd>Yes — only authorized officials can view complaints. Anonymous submission is an option.</dd>
            <dt>How long does a complaint take to resolve?</dt>
            <dd>Resolution time depends on category and department; admins can set SLAs.</dd>
            <dt>How do I add attachments?</dt>
            <dd>Use the attachment widget on the submission form — images &amp; documents up to the configured size limit.</dd>
          </dl>
        </section>

        <section id="troubleshooting" class="card">
          <h2>Troubleshooting</h2>
          <h3>Common issues</h3>
          <ul>
            <li><strong>App crashes on startup:</strong> Check environment variables, update packages, run <code>expo doctor</code>.</li>
            <li><strong>Android build fails:</strong> Clean gradle cache: <code>cd android && ./gradlew clean</code></li>
            <li><strong>Push notifications not received:</strong> Verify FCM keys and device tokens; check server logs.</li>
          </ul>
        </section>

        <section id="contribute" class="card">
          <h2>Contributing</h2>
          <p class="muted">We welcome contributions from teammates and the community. To contribute:</p>
          <ol>
            <li>Fork the repo</li>
            <li>Create a feature branch: <code>git checkout -b feat/your-feature</code></li>
            <li>Commit changes and open a Pull Request</li>
            <li>Wait for code review and merge</li>
          </ol>

          <h3>Code style</h3>
          <p class="muted">Follow ESLint rules provided in the repo. Use Prettier for code formatting.</p>
        </section>

        <section id="license" class="card">
          <h2>License</h2>
          <p class="muted">This project is licensed under the MIT License — see <code>LICENSE</code> for details.</p>
        </section>

        <section id="credits" class="card">
          <h2>Credits</h2>
          <ul>
            <li>Team Nexus — developers and designers</li>
            <li>Expo — for development tooling</li>
            <li>Open-source libraries used (list in <code>package.json</code>)</li>
          </ul>
        </section>

      </main>

      <aside>
        <div class="card">
          <h3>Quick Start</h3>
          <pre><code>npm install
npx expo start</code></pre>

          <h3>Screenshots</h3>
          <div class="screenshot">Add screenshots in <code>/assets/screenshots</code></div>
          <p class="muted">Tip: Add 3–5 attractive screenshots for the Play Store / App Store listing.</p>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Repository</h3>
          <p class="muted">Remote: <br><code>https://github.com/TEAMNEXUS-giet/grievance-redressal-portal.git</code></p>
          <a class="cta" href="https://github.com/TEAMNEXUS-giet/grievance-redressal-portal">Open repo</a>
        </div>

        <div class="card" style="margin-top:12px">
          <h3>Contact</h3>
          <p class="muted">Team Nexus — Project Lead: Soumyaranjan<br>Email: <code>teamnexus@giet.example</code></p>
        </div>
      </aside>
    </div>

    <footer>
      <div>Made with ❤️ by <strong>Team Nexus</strong></div>
      <div class="muted">© Team Nexus • <span id="year"></span></div>
    </footer>
  </div>

  <script>document.getElementById('year').textContent=new Date().getFullYear()</script>
</body>
</html>
