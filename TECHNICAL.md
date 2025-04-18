# Blockfinax: Technical Architecture & Implementation Documentation

## System Architecture Overview

Blockfinax is architected as a sophisticated multi-tier distributed system, implementing a microservices-based approach that enables enterprise-grade scalability, resilience, and security. The platform consists of several specialized layers that work in concert to deliver a comprehensive trade finance solution.

At its core, Blockfinax is built on a full-stack JavaScript foundation with a clear separation of concerns between frontend, backend, middleware, and blockchain integration components. This modular design ensures both flexibility for custom enterprise deployments and maintainability for long-term product evolution.

### Frontend Architecture

The Blockfinax client application is engineered for optimal performance, security, and user experience:

- **Core Technologies**:
  - **Framework**: React 18 with TypeScript 4.9+ for type-safe development
  - **Build System**: Vite with hot module replacement for rapid development cycles
  - **Package Management**: npm with strict dependency versioning and security scanning

- **State Management**:
  - **Local State**: React Context API for component-level state
  - **Server State**: TanStack Query v5 with optimistic updates and automatic refetching
  - **Persistence Layer**: Encrypted local storage for non-sensitive user preferences
  - **Redux Toolkit**: For complex global state management (authentication, application settings)

- **Routing & Navigation**:
  - **Core Router**: Wouter for lightweight, efficient client-side routing
  - **Route Protection**: Role-based access control with dynamic route guards
  - **Deep Linking**: Support for complex application states through URL patterns
  - **Navigation History**: Custom history management with breadcrumb support

- **UI Framework**:
  - **Component Library**: shadcn/ui built on Radix UI primitives for accessible, composable components
  - **Icons**: Lucide React for consistent visual language
  - **Design System**: Implementation of Blockfinax design tokens with theming support
  - **Animation**: Framer Motion for performance-optimized UI transitions
  - **Data Visualization**: Recharts for trade analytics and performance metrics

- **Styling & Layout**:
  - **CSS Framework**: Tailwind CSS with custom theme configuration
  - **Responsive Design**: Fluid grid system with mobile-first approach
  - **Internationalization**: Support for 14 languages with RTL layout capabilities
  - **Accessibility**: WCAG 2.1 AA compliance throughout the application

- **Form Management**:
  - **Form Library**: React Hook Form for performant, uncontrolled components
  - **Validation**: Zod schema validation with custom business logic extensions
  - **Field Components**: Purpose-built input components for trade finance data types
  - **Multi-step Forms**: Wizard pattern implementation for complex document processes

- **Blockchain Integration**:
  - **Web3 Library**: ethers.js v6 for type-safe interaction with Ethereum-compatible networks
  - **Wallet Connection**: Support for MetaMask, WalletConnect, and Ledger hardware wallets
  - **Transaction Management**: Queue system with retry logic and gas estimation
  - **Event Monitoring**: WebSocket subscriptions to smart contract events

- **Performance Optimizations**:
  - **Code Splitting**: Dynamic imports based on route and feature boundaries
  - **Virtualization**: Window-based rendering for large data sets (transaction history, document lists)
  - **Resource Loading**: Prioritized critical path rendering with deferred non-essential resources
  - **Caching Strategy**: Intelligent cache management for API responses with TTL policies

### Backend Architecture

The Blockfinax server implementation provides a robust, secure foundation for the platform:

- **Core Infrastructure**:
  - **Primary Runtime**: Node.js with Express.js framework
  - **Language**: TypeScript 4.9+ with strict type checking
  - **Process Management**: PM2 with clustering for optimal resource utilization
  - **Logging**: Structured logging with correlation IDs and log level management

- **Data Persistence**:
  - **Primary Database**: PostgreSQL 14+ with TimescaleDB extension for time-series data
  - **ORM**: Drizzle ORM with Zod schema validation for type-safe database operations
  - **Migration System**: Programmatic schema migrations with rollback capability
  - **Connection Management**: Connection pooling with automatic recovery
  - **Development Mode**: In-memory database option for development and testing

- **API Architecture**:
  - **API Style**: RESTful API with resource-based URL structure
  - **Response Format**: Standardized JSON envelope with metadata support
  - **Versioning**: URL-based API versioning for backward compatibility
  - **Rate Limiting**: Graduated rate limits based on user tier and endpoint sensitivity
  - **Batch Operations**: Support for bulk operations with atomic transaction guarantees

- **Security Infrastructure**:
  - **Authentication**: Multi-factor authentication with TOTP support
  - **Session Management**: express-session with connect-pg-simple for database-backed sessions
  - **Authorization**: Fine-grained permission model with role-based access control
  - **Identity Provider**: Custom implementation with Passport.js integration
  - **API Security**: CORS configuration, CSRF protection, and security headers

- **Document Processing**:
  - **Storage Strategy**: Encrypted blob storage with redundancy
  - **Metadata System**: Searchable document metadata stored in PostgreSQL
  - **Content Extraction**: OCR and data extraction pipeline for document processing
  - **Versioning**: Full version history with differencing capabilities
  - **Verification**: Cryptographic document integrity verification

- **Transaction Processing**:
  - **Queue Management**: Bull MQ for reliable job processing
  - **Idempotency**: Transaction idempotency guarantees with unique request IDs
  - **Distributed Locks**: Preventing race conditions in critical business operations
  - **Saga Pattern**: For managing multi-step financial transactions with compensation
  - **Audit System**: Comprehensive audit logging of all financial operations

- **Blockchain Integration**:
  - **Provider Management**: Failover-capable blockchain node connections
  - **Transaction Signing**: HSM integration for secure key management
  - **Gas Optimization**: Dynamic gas price strategy based on transaction priority
  - **Smart Contract Interaction**: Type-safe contract interfaces with automated tests
  - **Event Processing**: Blockchain event subscription and processing pipeline

### Comprehensive Data Flow Architecture

The Blockfinax platform implements a sophisticated multi-layered data flow architecture that ensures reliability, performance, and security across all system interactions:

#### Client-Side Request Flow

1. **Request Initiation**:
   - User interaction triggers component-level state change
   - TanStack Query mutation/query hook manages request lifecycle
   - Request interceptors add authentication headers and request metadata
   - Optimistic UI updates provide immediate feedback

2. **API Communication**:
   - RESTful API calls with standardized request format
   - Automatic retry logic for transient network failures
   - Request deduplication and caching of identical in-flight requests
   - Compression of request/response payloads

3. **Response Processing**:
   - Response validation against expected schema
   - Cache invalidation of affected resources
   - Update of local state with normalized data
   - Error boundary capture for graceful failure handling

#### Server-Side Processing Flow

1. **Request Reception**:
   - Express middleware stack processes incoming requests
   - Rate limiting and throttling based on client identity
   - Request validation with comprehensive error collection
   - Authentication and authorization verification

2. **Business Logic Processing**:
   - Service layer implements core business rules
   - Transaction boundaries ensure data consistency
   - Event emission for cross-cutting concerns
   - Comprehensive audit logging

3. **Data Access Layer**:
   - ORM abstracts database interaction details
   - Query optimization through prepared statements
   - Connection pooling for efficient resource utilization
   - Read/write splitting for performance (where applicable)

4. **Response Formulation**:
   - Standardized response envelope construction
   - Sensitive data filtering based on user permissions
   - Response compression and optimization
   - Cache headers for client-side caching guidance

#### Blockchain Integration Flow

1. **Blockchain Transaction Initiation**:
   - Smart contract method selection based on business operation
   - Parameter validation and sanitization
   - Gas estimation and fee optimization
   - Transaction signing with secure key management

2. **Transaction Submission**:
   - Primary node submission with failover capability
   - Transaction receipt monitoring
   - Block confirmation tracking
   - Timeout handling and retry mechanism

3. **Event Processing**:
   - Smart contract event subscription
   - Event parsing and validation
   - Database state synchronization
   - Notification dispatch to relevant subscribers

4. **Verification and Reconciliation**:
   - Periodic state reconciliation between blockchain and database
   - Orphaned transaction detection and resolution
   - Automated recovery procedures for edge cases
   - Compliance evidence collection and preservation

#### Cross-System Data Flow

1. **External System Integration**:
   - Standardized API gateway for third-party system communication
   - Data transformation and normalization
   - Credential management and rotation
   - Circuit breakers for dependency failures

2. **Event-Driven Communication**:
   - Message broker for asynchronous processing
   - Dead letter queues for failed message handling
   - Event sourcing for critical business operations
   - Replay capability for system recovery

3. **Batch Processing**:
   - Scheduled jobs for periodic operations
   - Partitioned processing of large datasets
   - Progress tracking and resumability
   - Resource throttling to prevent system overload

The multi-layered data flow architecture provides clear separation of concerns while ensuring robust, maintainable, and extensible system behavior across all components of the Blockfinax platform.

## Enterprise Data Model Architecture

The Blockfinax platform's data model has been meticulously designed to represent the complex relationships and entities involved in international trade finance while maintaining data integrity, performance, and compliance with financial industry standards.

### Core Business Domain Entities

#### User & Organization Management

**Users**
```typescript
interface User {
  id: number;                        // Unique identifier
  username: string;                  // Unique username for authentication
  password: string;                  // Securely hashed password
  walletAddress: string | null;      // Optional blockchain wallet address
  profileImage: string | null;       // Profile image URL
  kycStatus: KYCStatus;              // PENDING, VERIFIED, REJECTED
  riskScore: number | null;          // 0-100 risk assessment score
  kycData: KYCData | null;           // Detailed KYC information
  organizationId: number | null;     // Associated organization
  role: UserRole;                    // Role within the system
  permissions: string[];             // Granular permission flags
  lastLoginAt: Date | null;          // Last authentication timestamp
  createdAt: Date;                   // Account creation timestamp
  updatedAt: Date;                   // Last update timestamp
  status: AccountStatus;             // ACTIVE, SUSPENDED, DEACTIVATED
  twoFactorEnabled: boolean;         // Whether 2FA is enabled
  notificationPreferences: NotificationPreferences; // Communication preferences
}
```

**Organizations**
```typescript
interface Organization {
  id: number;                        // Unique identifier
  name: string;                      // Organization name
  registrationNumber: string;        // Legal registration number
  taxIdentifier: string;             // Tax ID (VAT, EIN, etc.)
  organizationType: OrganizationType; // Type of organization
  foundedYear: number | null;        // Year established
  size: OrganizationSize | null;     // Organization size category
  industryClassification: string[];  // Industry codes (NAICS, SIC)
  address: Address;                  // Registered address
  billingAddress: Address | null;    // Billing address if different
  website: string | null;            // Official website URL
  logo: string | null;               // Organization logo URL
  kycStatus: KYCStatus;              // PENDING, VERIFIED, REJECTED
  creditRating: string | null;       // External credit rating
  bankingDetails: BankingDetails[];  // Banking information
  createdAt: Date;                   // Record creation timestamp
  updatedAt: Date;                   // Last update timestamp
  status: OrganizationStatus;        // ACTIVE, SUSPENDED, DEACTIVATED
  tier: ServiceTier;                 // Service level tier
  customFields: Record<string, any>; // Industry-specific attributes
}
```

#### Financial Infrastructure

**Wallets**
```typescript
interface Wallet {
  id: number;                        // Unique identifier
  userId: number;                    // Owner user ID
  organizationId: number | null;     // Associated organization
  walletType: WalletType;            // MAIN, ESCROW
  contractId: number | null;         // Associated contract (for escrow)
  balance: string;                   // Decimal string (high precision)
  currency: string;                  // Currency code (ISO 4217)
  blockchainAddress: string | null;  // On-chain address if applicable
  isMultiSig: boolean;               // Whether requires multiple signatures
  signatories: number[] | null;      // Required signatories (user IDs)
  threshold: number | null;          // Required signature threshold
  externalReference: string | null;  // Reference ID in external systems
  dailyLimit: string | null;         // Daily transaction limit
  status: WalletStatus;              // ACTIVE, FROZEN, CLOSED
  metadata: Record<string, any>;     // Additional wallet metadata
  createdAt: Date;                   // Wallet creation timestamp
  updatedAt: Date;                   // Last update timestamp
}
```

**Transactions**
```typescript
interface Transaction {
  id: number;                        // Unique identifier
  transactionHash: string | null;    // Blockchain transaction hash
  fromWalletId: number | null;       // Source wallet (null for deposits)
  toWalletId: number | null;         // Destination wallet (null for withdrawals)
  amount: string;                    // Transaction amount
  currency: string;                  // Currency code (ISO 4217)
  exchangeRate: string | null;       // Exchange rate if currency conversion
  fee: string | null;                // Transaction fee
  feeBearer: FeeBearerType | null;   // Who pays the fee
  txType: TransactionType;           // DEPOSIT, WITHDRAWAL, TRANSFER, etc.
  status: TransactionStatus;         // PENDING, COMPLETED, FAILED
  contractId: number | null;         // Associated contract
  invoiceId: number | null;          // Associated invoice
  description: string | null;        // Transaction description
  reference: string | null;          // External reference/tracking number
  initiatedBy: number;               // User who initiated transaction
  approvedBy: number[] | null;       // Users who approved (for multi-sig)
  rejectedBy: number | null;         // User who rejected (if applicable)
  scheduleDate: Date | null;         // Future execution date if scheduled
  executedAt: Date | null;           // Actual execution timestamp
  createdAt: Date;                   // Transaction creation timestamp
  metadata: Record<string, any>;     // Additional transaction metadata
  reconciliationStatus: ReconciliationStatus; // For accounting reconciliation
}
```

#### Trade Documentation & Contracts

**Contracts**
```typescript
interface Contract {
  id: number;                        // Unique identifier
  contractAddress: string | null;    // On-chain smart contract address
  contractNumber: string;            // Human-readable reference number
  title: string;                     // Contract title
  description: string | null;        // Detailed description
  status: ContractStatus;            // Current contract status
  createdBy: number;                 // User who created the contract
  parties: Party[];                  // Involved parties
  tradeTerms: TradeTerms;            // Detailed trade terms
  milestones: Milestone[];           // Contract execution milestones
  escrowWalletId: number | null;     // Associated escrow wallet
  totalValue: string;                // Total contract value
  currency: string;                  // Contract currency
  governingLaw: string | null;       // Jurisdiction governing the contract
  disputeResolution: string | null;  // Dispute resolution mechanism
  confidentiality: ConfidentialityLevel; // Confidentiality classification
  tags: string[];                    // Organizational tags
  expiryDate: Date | null;           // Contract expiration date
  terminationDate: Date | null;      // Early termination date (if applicable)
  autoRenewal: boolean;              // Whether contract auto-renews
  createdAt: Date;                   // Contract creation timestamp
  updatedAt: Date;                   // Last update timestamp
  complianceStatus: ComplianceStatus; // Regulatory compliance status
  riskAssessment: RiskAssessment | null; // Contract risk evaluation
  customClauses: ContractClause[];   // Custom contract clauses
}
```

**Documents**
```typescript
interface Document {
  id: number;                        // Unique identifier
  name: string;                      // Document name
  type: DocumentType;                // Document type classification
  size: number;                      // File size in bytes
  hash: string;                      // Cryptographic hash for verification
  url: string;                       // Storage URL
  mimeType: string;                  // MIME type
  contractId: number | null;         // Associated contract
  invoiceId: number | null;          // Associated invoice
  tradeFinanceId: number | null;     // Associated trade finance application
  uploadedBy: number;                // User who uploaded the document
  uploadedAt: Date;                  // Upload timestamp
  expiryDate: Date | null;           // Document expiration date (if applicable)
  issuingAuthority: string | null;   // Authority that issued the document
  issueDate: Date | null;            // Date when document was issued
  verificationStatus: VerificationStatus; // Document verification status
  verifiedBy: number | null;         // User who verified the document
  verifiedAt: Date | null;           // Verification timestamp
  blockchainRecord: BlockchainRecord | null; // On-chain verification details
  tags: string[];                    // Organizational tags
  access: AccessControl[];           // Access control rules
  versions: DocumentVersion[];       // Version history
  annotations: Annotation[];         // User annotations/comments
  customMetadata: Record<string, any>; // Domain-specific metadata
  classifications: string[];         // Security/compliance classifications
}
```

**Invoices**
```typescript
interface Invoice {
  id: number;                        // Unique identifier
  invoiceNumber: string;             // Unique invoice reference
  contractId: number | null;         // Associated contract
  sellerId: number;                  // Seller organization/user
  buyerId: number;                   // Buyer organization/user
  amount: string;                    // Total invoice amount
  currency: string;                  // Invoice currency
  taxAmount: string | null;          // Tax amount
  taxPercentage: number | null;      // Tax percentage
  discountAmount: string | null;     // Discount amount
  discountPercentage: number | null; // Discount percentage
  issueDate: Date;                   // Invoice issuance date
  dueDate: Date;                     // Payment due date
  status: InvoiceStatus;             // Current payment status
  items: InvoiceItem[];              // Line items
  paymentTerms: string | null;       // Payment terms description
  notes: string | null;              // Additional notes
  paymentMethod: PaymentMethod | null; // Preferred payment method
  billingAddress: Address;           // Billing address
  shippingAddress: Address | null;   // Shipping address if different
  paidAmount: string;                // Amount already paid
  paidDate: Date | null;             // Date when fully paid
  remittanceInstructions: string | null; // Payment instructions
  attachments: number[];             // Associated document IDs
  createdAt: Date;                   // Creation timestamp
  updatedAt: Date;                   // Last update timestamp
  isTokenized: boolean;              // Whether invoice has been tokenized
  tokenizationDetails: TokenizationDetails | null; // If tokenized
}
```

#### Trade Finance Instruments

**Trade Finance Applications**
```typescript
interface TradeFinanceApplication {
  id: number;                        // Unique identifier
  applicationType: TradeFinanceType; // Type of financing instrument
  applicationNumber: string;         // Reference number
  userId: number;                    // Applicant user ID
  organizationId: number;            // Applicant organization ID
  contractId: number | null;         // Associated contract
  amount: string;                    // Financing amount requested
  currency: string;                  // Currency code
  status: TradeFinanceStatus;        // Application status
  applicationDate: Date;             // Submission date
  approvalDate: Date | null;         // Approval date
  expiryDate: Date | null;           // Expiry date of the instrument
  effectiveDate: Date | null;        // Effective date if approved
  terms: FinanceTerms;               // Detailed terms and conditions
  interestRate: number | null;       // Annual interest rate (if applicable)
  fees: Fee[];                       // Associated fees
  collateral: Collateral[] | null;   // Collateral information
  supportingDocuments: number[];     // Supporting document IDs
  underwriter: number | null;        // Underwriter user ID
  approvedBy: number | null;         // Approver user ID
  fundingSource: string | null;      // Source of financing
  disbursementMethod: DisbursementMethod | null; // How funds are disbursed
  repaymentSchedule: RepaymentSchedule[] | null; // Repayment plan
  riskAssessment: FinanceRiskAssessment | null; // Risk evaluation
  comments: Comment[];               // Application comments/notes
  history: StatusChange[];           // Status change history
  creditEnhancement: CreditEnhancement[] | null; // Credit enhancements
  createdAt: Date;                   // Creation timestamp
  updatedAt: Date;                   // Last update timestamp
}
```

### Relationship Diagram

The Blockfinax data model features complex relationships that enable comprehensive trade finance workflows:

```
Organizations 1──┐
                 │
                 ├──n Users
                 │
                 ├──n Wallets
                 │
Contracts n──────┘
    │
    ├──1 Escrow Wallet
    │
    ├──n Documents
    │
    ├──n Invoices
    │     │
    │     └──n Documents
    │
    └──n Trade Finance Applications
          │
          └──n Documents
```

### Data Model Design Principles

The Blockfinax data model adheres to the following design principles:

1. **Financial Accuracy**: Using string representations for monetary values to prevent floating-point precision errors
2. **Audit Capability**: Comprehensive timestamping and change tracking across all entities
3. **Regulatory Compliance**: Structured to support AML, KYC, and trade finance regulations
4. **Blockchain Integration**: Native support for on-chain transaction references and verification
5. **Multi-party Workflows**: Designed for complex multi-stakeholder processes
6. **Extensibility**: Custom fields and metadata support for industry-specific requirements
7. **Internationalization**: Full support for multiple currencies and jurisdictions
8. **Historical Integrity**: Non-destructive updates with version history where appropriate
9. **Access Control**: Granular permission model integrated into the data structure
10. **Performance Consideration**: Optimized for common query patterns in trade workflows

## Key Technical Components

### Smart Contract Integration

The platform integrates with Ethereum-compatible blockchains through a custom Web3 service. The core smart contract functionality includes:

```typescript
// Simplified ABI for the escrow contract
const ESCROW_CONTRACT_ABI = [
  "function createEscrow(address _seller, address _mediator, uint256 _value, uint256 _releaseTime) payable returns (uint256)",
  "function getEscrowDetails(uint256 _escrowId) view returns (address buyer, address seller, address mediator, uint256 amount, uint256 releaseTime, uint8 status)",
  "function confirmDelivery(uint256 _escrowId)",
  "function refundBuyer(uint256 _escrowId)",
  "function resolveDispute(uint256 _escrowId, bool _releaseToSeller)",
  "function raiseDispute(uint256 _escrowId)"
];
```

### Contract State Management

Contracts follow a clear lifecycle with the following states:

```typescript
export enum ContractStatus {
  DRAFT = 'DRAFT',
  AWAITING_FUNDS = 'AWAITING_FUNDS',
  FUNDED = 'FUNDED',
  GOODS_SHIPPED = 'GOODS_SHIPPED',
  GOODS_RECEIVED = 'GOODS_RECEIVED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED'
}
```

### Document Verification

Documents are verified using blockchain by:
1. Computing document hash
2. Storing hash in the blockchain
3. Verifying document authenticity by comparing hashes

### Storage Interface

The application uses a flexible storage interface that can work with different backends:

```typescript
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  // ...more methods...
  
  // Contract methods
  getContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | undefined>;
  // ...more methods...
  
  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  // ...more methods...
}
```

### API Routes

The backend exposes RESTful API endpoints for all core functionality:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Contracts**: `/api/contracts/*`
- **Documents**: `/api/documents/*`
- **Wallets**: `/api/wallets/*`
- **Transactions**: `/api/transactions/*`
- **Invoices**: `/api/invoices/*`
- **Trade Finance**: `/api/trade-finance/*`

## Development Workflow

### Project Structure

```
├── client/             # Frontend code
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   ├── services/   # Service classes
│   │   └── types/      # TypeScript type definitions
├── server/             # Backend code
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage interface
│   └── vite.ts         # Vite integration
├── shared/             # Shared code
│   └── schema.ts       # Database schema and types
└── public/             # Static assets
```

### Running the Project

The application is configured to run with a single command:

```bash
npm run dev
```

This starts both the Express backend server and the Vite development server for the frontend.

## Security Considerations

### Authentication and Authorization

- Session-based authentication for web interface
- JWT tokens for API authentication
- Route protection for sensitive operations

### Data Protection

- Encrypted storage of sensitive information
- Hash verification for document integrity
- Access control for document viewing and management

### Blockchain Security

- Smart contract auditing
- Secure key management for blockchain transactions
- Multi-signature requirements for critical operations

## Future Enhancements

1. **Expanded Blockchain Support**: Integration with additional blockchain networks
2. **AI-Powered Risk Assessment**: Machine learning for trade risk analysis
3. **Supply Chain Tracking**: Integration with IoT for real-time shipment tracking
4. **Enhanced API Ecosystem**: Developer APIs for platform integration
5. **Mobile Applications**: Native mobile apps for on-the-go trade management

## Deployment Architecture

The application is designed to be deployed on scalable cloud infrastructure:

- Frontend: Static hosting with CDN
- Backend: Containerized microservices
- Database: Managed PostgreSQL service
- Blockchain Nodes: Hybrid of managed services and dedicated nodes

## Performance Optimization

1. **Query Optimization**: Efficient database queries
2. **Caching Strategy**: Response caching for common requests
3. **Lazy Loading**: Component and data lazy loading
4. **Asset Optimization**: Compressed static assets
5. **SSR Consideration**: Server-side rendering for critical paths