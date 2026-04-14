CHAPTER 5

IMPLEMENTATION AND DEPLOYMENT

5.1 Technologies Used

The implementation of the CertChain platform relies on a sophisticated, highly modernized hybrid Web3 technology stack. By carefully selecting industry-standard tools and frameworks, the platform guarantees high-speed user interactivity, rigorous data processing capabilities, and immutable cryptographic security.

The core technologies utilized in the implementation include:

Frontend Layer: Engineered using React (version 19.2.4) alongside TypeScript (version 6.0.2), providing robust static type checking that minimizes runtime errors. The interface incorporates Framer Motion for declarative animations and Tailwind CSS for responsive, utility-first styling.

Build System: Bundled utilizing the Vite (version 8.0.4) build tool, combined with the React 19 Compiler, to guarantee lightning-fast hot module replacement during development and highly optimized static assets for production deployment.

Backend Application Logic: Powered by a Node.js runtime environment utilizing the Express.js (version 5.2.1) web framework to expose a secure Representational State Transfer (REST) application programming interface.

Database & Persistence: Integrated with a highly relational MySQL database utilizing the mysql2 connection driver with a strictly configured Promise pool.

Blockchain Ecosystem: The decentralized layer is programmed in Solidity (version 0.8.20) using the Hardhat development framework. The Node.js backend acts as a cryptographic relayer, communicating with the blockchain network via the Ethers.js (version 6.16.0) library.

5.2 Frontend Implementation

The frontend architecture is implemented as a dynamic single-page application utilizing React Router DOM (version 7.14.0) to manage complex, role-based client-side navigation seamlessly.

Key frontend implementation details include:

Centralized State and Authentication: The application leverages the React Context API (AuthContext.tsx) to manage global authentication states. Upon successful login, the JSON Web Token (JWT) and user profile are securely persisted in local storage and re-hydrated dynamically upon application mounting.

API Service Layer: A centralized API module is implemented using Axios. This module features automated request interceptors that seamlessly attach the stored bearer token to the authorization headers of all outbound HTTP requests, ensuring secure communication with the backend.

Automated Document Generation: To support traditional distribution, the frontend implements a sophisticated PDF export utility within the Certificate Details view. Utilizing html-to-image to bypass CSS rendering bugs and jsPDF for formatting, the system dynamically renders a high-resolution, off-screen HTML component (1123×794 pixels) into a landscape A4 PDF, complete with the embedded verification QR code.

Role-Based Routing Guard: The application dynamically evaluates the user's role (Standard User, Admin, or Super Admin) stored within the Context API, routing institutional administrators to the AdminDashboard while restricting public visitors to the landing and verification portals.

5.3 Backend Implementation and Cryptographic Hashing

The server-side implementation follows a strict, modular architecture designed to logically isolate business rules, database queries, and blockchain relay mechanisms.

Key backend implementation details include:

Database Connection Pooling: To maintain high throughput during concurrent public verification requests, the backend utilizes the mysql2 driver with a strict connection pool limit of 10 simultaneous connections, preventing memory exhaustion on the relational database.

Cryptographic Normalization: A critical implementation within the backend is the generateCertHash utility. To guarantee the absolute stability of the SHA-256 hash, the algorithm rigorously trims whitespace, lowercases all email inputs, and mathematically floors the JavaScript timestamp to the nearest second (Math.floor(Date.now() / 1000) * 1000). This completely eliminates millisecond jitter discrepancies between the Node.js runtime and the MySQL TIMESTAMP data type.

Dual-Layer Verification Protocol: The public verification endpoint implements a highly secure dual-check system. Upon receiving a request, the backend first fetches the raw credential data from MySQL and independently recalculates the SHA-256 hash. If the recalculated hash matches the stored database hash, the server then queries the blockchain via Ethers.js to confirm the on-chain validity status. A timeout guard of 10 seconds is wrapped around the blockchain request to ensure the frontend does not hang indefinitely during network congestion.

5.4 Smart Contract Implementation

The decentralized storage layer is engineered using a bespoke Solidity smart contract (CertificateStore.sol) designed to act as a highly efficient, immutable ledger of truth.

Key smart contract implementations include:

Zero-Knowledge State Storage: The contract explicitly avoids storing any Personally Identifiable Information. It utilizes an internal mapping structure to exclusively associate a 64-character cryptographic hash string with a specific InstitutionId and a block issuance timestamp.

Access Control Modifiers: The contract enforces a strict onlyOwner modifier on all state-changing functions, such as issueCertificate and revokeCertificate. This ensures that only the authorized CertChain backend wallet, which holds the encrypted private key, can anchor or alter records on the public ledger.

Gasless Public Verification: The primary verifyCertificate function is explicitly designated as a public view method. This architectural decision allows the backend relayer, or any independent third-party auditor, to query the blockchain's state instantly without incurring computational gas fees.

5.5 Security and Middleware

Platform security is rigorously enforced through a layered middleware architecture that intercepts and validates all incoming network requests long before they reach the core business logic or database layers.

Key security implementations include:

Stateless Authentication: Custom authentication middleware cryptographically verifies the signature of JSON Web Tokens attached to incoming requests. The payload explicitly encodes the user's ID, institutional affiliation, and access role.

SaaS Subscription Guard: To enforce the multi-tenant business model, the platform implements a checkSubscriptionLimit middleware. Before any certificate is issued, this module queries the Subscriptions table to verify the institution's plan status, restricting 'TRIAL' plans to 100 credentials and 'BASIC' plans to 500, while granting unlimited throughput to 'PRO' and 'ENTERPRISE' tenants.

Password Cryptography: All user passwords are encrypted utilizing the bcrypt hashing algorithm with 10 computational salt rounds prior to database insertion, completely neutralizing the risk of plain-text credential exposure.

5.6 Deployment Environment

The final deployment architecture is distributed across specialized cloud environments to ensure high availability, absolute fault tolerance, and minimal latency for global end-users.

Key deployment details include:

Edge Network Frontend Delivery: The vercel.json configuration file is utilized to deploy the compiled React single-page application directly to the Vercel edge network. Specific URL rewrite rules are implemented to catch all traffic and route it to the index.html file, ensuring seamless client-side routing.

Cloud Backend Service: The Node.js transactional backend is hosted as a dedicated web service on Render.com. The environment is strictly controlled via hidden environment variables containing sensitive cryptographic secrets, database connection strings, and the master OWNER_PRIVATE_KEY required for blockchain interactions.

Production Blockchain Ledger: The foundational CertificateStore.sol smart contract is permanently deployed to the Polygon Amoy Testnet. The backend communicates with this network via high-speed Remote Procedure Calls (RPC) utilizing the Alchemy infrastructure provider, guaranteeing high transaction throughput and minimal block confirmation times.

State Migration Utilities: To accommodate potential network resets or migrations, the infrastructure includes a dedicated re-anchor.js script. This utility queries the MySQL database for all valid certificates and sequentially replays the issuance transactions onto a fresh smart contract, ensuring continuous data consistency across layers.

5.7 System Interface and Modules

5.7.1 Public Landing Page and Hero Section

The entry point of the CertChain platform delivers a highly professional, modern visual experience designed to immediately convey institutional trust and technological authority. The landing page emphasizes the core value proposition of decentralized verification.

Features a prominent "Mainnet Active" dynamic badge to indicate live blockchain synchronization.

Displays a clear, high-impact headline ("The Standard for Immutable Truth") accompanied by a simulated transaction validation graphic.

Integrates clear Call-to-Action (CTA) buttons directing users either to the public verification portal or to learn more about the platform's capabilities.

[INSERT image_4ead43.png HERE]
Figure 5.1: Screenshot of the CertChain public landing page featuring the dynamic hero section and transaction validation graphic.

Sample Code of Landing Page Component

```tsx
// frontend/src/pages/Home.tsx (Architecture Excerpt)
import { motion } from 'framer-motion';
import PublicVerify from './PublicVerify';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Framer Motion Animations */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span className="text-xs font-black text-brand-700 uppercase tracking-widest">Mainnet Active</span>
            </div>
            <h1 className="text-7xl font-black text-gray-900 tracking-tight mb-6">
              The Standard for <span className="text-gradient">Immutable Truth</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10">
              CertChain empowers institutions to issue cryptographically verifiable 
              credentials directly to a decentralized ledger, eliminating fraud at the source.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Embedded Public Verification Engine */}
      <section className="bg-gray-50/50 py-24 border-y border-gray-100">
        <PublicVerify isEmbedded={true} />
      </section>
    </div>
  );
}
```


5.7.2 Secure Authentication Interface

The authentication interface provides a streamlined, secure gateway for institutional administrators and staff to access their respective tenant dashboards.

Utilizes a centralized, minimalist modal layout over a clean background, maintaining user focus entirely on the credential input process.

Features integrated form validation for institutional email addresses and passwords.

Connects directly to the backend JWT authentication middleware, seamlessly routing the user to the appropriate role-based dashboard upon successful sign-in.

[INSERT image_4eaa1f.png HERE]
Figure 5.2: Screenshot of the "Sign In" secure authentication interface designed for institutional access.

Sample Code of Authentication Component

```tsx
// frontend/src/pages/Login.tsx (Implementation Excerpt)
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // AuthContext hook
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await api.post('/auth/login', { email, password });
        
        // Persist token and user profile to localStorage via context
        login(res.data.token, res.data.user);
        toast.success('Access Granted (JWT Verified)');

        // Role-based routing logic
        if (res.data.user.isSuperAdmin) {
            navigate('/super-admin/dashboard');
        } else if (res.data.user.role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else {
            navigate('/student/dashboard');
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Sign in to Portal</button>
    </form>
  );
}
```


5.7.3 SaaS Subscription and Pricing

The pricing interface clearly delineates the multi-tenant SaaS architecture of the platform, outlining the specific limits and capabilities afforded to varying institutional tiers.

Presents three distinct subscription tiers: Basic Trial (Free), Professional ($499/mo), and Enterprise (Custom).

Clearly lists the feature restrictions per tier, actively reflecting the backend checkSubscriptionLimit middleware limits (e.g., 100 Certificates for Trial vs. Unlimited for Professional).

Provides direct onboarding pathways for institutions to initiate their deployment based on their specific volume requirements.

[INSERT image_4eaa22.png HERE]
Figure 5.3: Screenshot of the SaaS Pricing interface outlining the tiered subscription models and feature allocations.

Sample Code of Pricing Component

```tsx
// frontend/src/pages/Pricing.tsx (SaaS Tiers Excerpt)
function PricingCard({ tier, price, desc, features, highlighted = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[3rem] border-2 transition-all duration-300 ${
        highlighted ? 'border-brand-500 bg-white shadow-2xl z-10' : 'border-gray-100 bg-white'
      }`}
    >
      <h3 className="text-xl font-black text-gray-900 mb-2">{tier}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-black text-gray-900">{price}</span>
        {price !== 'Free' && price !== 'Custom' && <span className="text-gray-400 font-bold">/mo</span>}
      </div>
      <ul className="space-y-4 mb-10">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <div className={`p-1 rounded-full ${highlighted ? 'bg-brand-100 text-brand-600' : 'bg-gray-100'}`}>
              <Check size={14} />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <button className={highlighted ? "bg-brand-500 text-white" : "bg-gray-50"}>
        Get Started <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}
```


5.7.4 Blockchain Public Verification Portal

The core public-facing utility of the platform is the Verification Portal, allowing third-party auditors and employers to independently confirm the authenticity of any issued credential.

Features a minimalist, distraction-free search interface requiring only the unique 36-character Certificate UUID.

Integrates a helpful instructional banner ("How to find the ID?") to guide users who are scanning physical QR codes or digital PDFs.

Triggers the backend dual-layer verification protocol, instantly returning color-coded trust badges reflecting the live database and blockchain state.

[INSERT image_4eaa39.png HERE]
Figure 5.4: Screenshot of the Blockchain Public Verification Portal featuring the UUID search input.

Sample Code of Public Verification Component

```tsx
// frontend/src/pages/PublicVerify.tsx (Engine Excerpt)
export default function PublicVerify({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // UUID Sanitization: Extracts UUID from full pasted share-links
    let sanitizedId = certId.trim();
    if (sanitizedId.includes('/verify/')) {
        sanitizedId = sanitizedId.split('/verify/').pop() || '';
    }

    if (!sanitizedId) return;
    setLoading(true);
    try {
        // Calls the dual-layer backend verifier (DB + Blockchain sync)
        const res = await api.get(`/certificates/verify/${sanitizedId}`);
        setResult(res.data);
        toast.success('Verification Complete');
    } catch (error: any) {
        setResult(error.response?.data || { status: 'FAILED' });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleVerify} className="relative shadow-lg">
      <input 
        placeholder="Enter Certificate UUID..." 
        value={certId} 
        onChange={e => setCertId(e.target.value)} 
      />
      <button type="submit">Verify</button>
      {/* Result UI rendered dynamically based on result.status */}
    </form>
  );
}
```


5.7.5 Institutional Overview Dashboard

Upon authentication, institutional administrators are routed to a comprehensive, high-level command center to monitor their specific credentialing operations and blockchain connectivity.

Displays vital Key Performance Indicators (KPIs) including Total Issued credentials, Public Verifications, and the current SaaS Plan status.

Features an "EVM Network Identity" panel, confirming live ledger synchronization status and the active smart contract version in real-time.

Provides a dedicated Subscription Health module to alert administrators of remaining trial days or upcoming billing cycles.

[INSERT image_4ead06.png HERE]
Figure 5.5: Screenshot of the Institutional Overview dashboard displaying issuance telemetry and EVM synchronization status.

Sample Code of Admin Dashboard Component

```tsx
// frontend/src/pages/AdminDashboard.tsx (Analytics Excerpt)
const fetchStats = async () => {
  try {
    const res = await api.get('/institutions/stats');
    setStats(res.data);
    // Expected Payload: {
    //   totalCertificates: number,
    //   totalVerifications: number,
    //   subscription: { plan_name: string, expires_at: string },
    //   institutionName: string
    // }
  } catch (err) {
    toast.error('Failed to synchronize telemetry');
  }
};

// Rendering KPI Modules
<StatCard 
  icon={<Award size={24} />} 
  label="Total Issued" 
  value={stats.totalCertificates} 
/>
<StatCard 
  icon={<Users size={24} />} 
  label="Public Verifications" 
  value={stats.totalVerifications} 
/>
<StatCard 
  icon={<Zap size={24} />} 
  label="SaaS Plan" 
  value={stats.subscription.plan_name} 
/>
```


5.7.6 Cryptographic Issuance Interface

The primary administrative action—issuing new credentials—is handled through a streamlined, secure data entry portal designed to prevent input errors before cryptographic hashing occurs.

Provides clean input fields capturing essential student details: Full Name, Email Address, and the specific Certification Program/Course.

Features a prominent "Secure on Blockchain" submission button, explicitly noting the estimated mining time (5-10 seconds) to manage user expectations during the on-chain anchoring process.

Submits data to the backend for immediate SHA-256 normalization and Ethers.js transmission.

[INSERT image_4ead24.png HERE]
Figure 5.6: Screenshot of the "Issue New Credential" administrative interface.

Sample Code of Issue Certificate Component

```tsx
// frontend/src/pages/IssueCertificate.tsx (State Machine Excerpt)
const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuingState('HASHING');
    setProgress(25);
    
    try {
        await new Promise(r => setTimeout(r, 800)); // Hashing emulation delay
        
        setIssuingState('BLOCKCHAIN');
        setProgress(60);

        // API initiates the Ethers.js transaction on the backend
        const res = await api.post('/certificates/issue', {
            studentEmail: email,
            studentName: name,
            courseName: course
        });

        setIssuingState('FINALIZING');
        setProgress(90);
        await new Promise(r => setTimeout(r, 800));

        setIssuingState('SUCCESS');
        setProgress(100);
        setLastIssuedCert(res.data.certificate); // Stores ID and QR Code payload
        toast.success('Certificate Secured on Ledger!');
    } catch (error: any) {
        setIssuingState('IDLE');
        toast.error(error.response?.data?.message || 'Issuance failed');
    }
};
```


5.7.7 Governance Vault (Certificate Records)

The Governance Vault acts as the comprehensive, immutable audit log for the institution, tracking the status of every credential ever anchored to the platform.

Renders a highly organized data table displaying Graduate Details, the specific Program, the Secured Date, and a preview of the on-chain transaction hash.

Includes dynamic status badges (e.g., ACTIVE in green, REVOKED in red) directly mapped to the relational database state.

Empowers administrators with powerful filtering tools to isolate records by student name, email, or specific credential status.

[INSERT image_4ead0a.png HERE]
Figure 5.7: Screenshot of the Governance Vault detailing the institutional certificate records and status badges.

Sample Code of Certificate List Component

```tsx
// frontend/src/pages/CertificateList.tsx (Vault Filtering Excerpt)
export default function CertificateList() {
  const [certs, setCerts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED'>('ALL');

  const filteredCerts = certs.filter(cert => {
    const matchesSearch =
        cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.student_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !cert.is_revoked) ||
        (statusFilter === 'REVOKED' && cert.is_revoked);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Filtering Logic UI */}
      <input 
        placeholder="Search student name..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
      />
      {/* Data Table Rendering */}
      {filteredCerts.map((cert) => (
        <tr key={cert.id} className="hover:bg-gray-50">
          <td>{cert.student_name}</td>
          <td>{cert.course_name}</td>
          <td>{cert.is_revoked ? 'Revoked' : 'Active'}</td>
        </tr>
      ))}
    </div>
  );
}
```


5.7.8 Portal Configuration and Settings

The Settings module allows administrators to manage their institutional identity and basic security protocols within the isolated multi-tenant environment.

Provides a structured interface for updating the "Identity Core," including the Institution Display Name.

Displays the auto-generated Protocol Identifier (Slug) utilized for custom-branded portal routing.

Features a Security Contact section to manage the administrative email notices associated with the institution's account.

[INSERT image_4eaa3c.png HERE]
Figure 5.8: Screenshot of the Portal Configuration interface illustrating institutional identity management settings.

Sample Code of Settings Component

```tsx
// frontend/src/pages/Settings.tsx (Configuration Excerpt)
export default function Settings() {
  const [instName, setInstName] = useState('');
  const [slug, setSlug] = useState('');
  const [activeTab, setActiveTab] = useState<string>('general');

  const fetchProfile = async () => {
    const res = await api.get('/institutions/stats');
    setInstName(res.data.institutionName);
    setSlug(res.data.slug);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        // Simulates synchronization with institutional identity ledger
        await new Promise(r => setTimeout(r, 1000));
        toast.success('Configuration Synchronized!');
    } finally { setSaving(false); }
  };

  return (
    <div className="grid grid-cols-3 gap-10">
      <nav className="space-y-2">
        <SidebarLink active={activeTab === 'general'} label="General Profile" icon={<Building2 />} />
        <SidebarLink active={activeTab === 'branding'} label="Branding" icon={<Layout />} />
        {/* Additional configuration modules */}
      </nav>
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6">
          <input value={instName} onChange={e => setInstName(e.target.value)} />
          <input value={slug} readOnly className="bg-gray-100 cursor-not-allowed" />
          <button type="submit">Apply Changes</button>
        </form>
      )}
    </div>
  );
}
```


5.7.9 Certificate Details and PDF Export

The Certificate Details view provides administrators with a comprehensive, single-record audit page for any issued credential, combining full metadata display with administrative actions.

Displays the full on-chain Audit Trail: transaction hash, block confirmation number, and the 64-character SHA-256 content identity hash in a monospaced format.

Offers a Danger Zone panel with an irreversible blockchain revocation action, protected by a browser confirmation dialog prior to execution.

Generates a downloadable landscape A4 PDF certificate (1123×794 px) via html-to-image and jsPDF, embedding the student name, course, institution, issue date, QR code, and blockchain hash.

Sample Code of Certificate Details Component

```tsx
// frontend/src/pages/CertificateDetails.tsx (PDF Generation Excerpt)
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function CertificateDetails() {
  const printRef = React.useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    const toastId = toast.loading('Generating secure PDF...');
    try {
        // High-fidelity capture bypasses SVG-to-Canvas limitations
        const imgData = await toPng(printRef.current, {
            pixelRatio: 2,
            backgroundColor: '#ffffff'
        });
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate_Verified_${cert.id.substring(0, 8)}.pdf`);
        toast.success('Certificate Exported', { id: toastId });
    } catch (error) {
        toast.error('PDF Generation Failed', { id: toastId });
    } finally { setDownloading(false); }
  };

  const handleRevoke = async () => {
    if (!window.confirm('Are you absolutely sure? Revocation is permanent on the blockchain.')) return;
    try {
        await api.post(`/certificates/revoke/${id}`);
        toast.success('Certificate Revoked on Public Ledger');
        fetchDetails(); // Reload state
    } catch (err) { toast.error('Revocation Error'); }
  };
}
```


5.7.10 Super Administrator Platform Dashboard

The Super Administrator Dashboard provides a global, bird's-eye view of the entire CertChain SaaS platform, exclusively accessible to the platform owner account.

Displays four platform-wide KPIs: Active Tenants (total institutions), Global Certs, total Verifications, and the live Verification Success Rate percentage.

Provides a full, filterable institution management table listing every registered tenant with their slug and active status.

Features an Integrity Health panel showing the ratio of genuine verifications vs. tampered attempts, sourced directly from VerificationLogs.

Includes an animated onboarding modal enabling the Super Admin to register new institutions directly (POST /api/institutions), bypassing the self-service signup flow.

Sample Code of Super Admin Dashboard Component

```tsx
// frontend/src/pages/SuperAdminDashboard.tsx (Global Telemetry Excerpt)
export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [institutions, setInstitutions] = useState<any[]>([]);

  const fetchGlobalData = async () => {
    try {
        // Parallel execution for zero-latency UI population
        const [statsRes, instRes] = await Promise.all([
            api.get('/institutions/global-stats'),
            api.get('/institutions')
        ]);
        setStats(statsRes.data);
        setInstitutions(instRes.data);
    } catch (error) {
        toast.error('Failed to load global administrative context');
    }
  };

  const successRate = stats ? Math.round((stats.verificationStats.success / stats.verificationStats.total) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* Global Metadata Cards */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard label="Active Tenants" value={stats?.totalInstitutions} />
        <MetricCard label="Global Certs" value={stats?.totalCertificates} />
        <MetricCard label="Total Verifications" value={stats?.verificationStats.total} />
        <MetricCard label="Success Rate" value={`${successRate}%`} />
      </div>
      {/* Institution Control Layer renders institutions list table below */}
    </div>
  );
}
```
