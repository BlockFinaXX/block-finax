# Blockfinax: Quick Start Guide

This guide helps you get Blockfinax up and running quickly for development or testing purposes. The Blockfinax platform provides a comprehensive blockchain-based escrow solution for international trade finance.

## Prerequisites

### Development Environment Requirements

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git
- PostgreSQL (optional, in-memory storage available for development)

### Enterprise Requirements

For enterprise-grade deployments, you'll need:

- **Infrastructure**
  - Multi-node server infrastructure for high availability
  - Load balancers for request distribution
  - Dedicated database servers with replication
  - Enterprise-grade blockchain nodes (Ethereum or compatible)

- **Network**
  - Secure VPN access for administrative functions
  - Firewall configuration for blockchain network access
  - SSL certificates for secure communication
  - CDN integration for static assets

- **Security**
  - Hardware Security Modules (HSM) for key management
  - Identity and Access Management (IAM) solution
  - Security Information and Event Management (SIEM) system
  - Data Loss Prevention (DLP) tools

- **Compliance**
  - Audit logging capabilities
  - Regulatory compliance reporting tools
  - Secure archiving solutions for long-term data storage
  - Enterprise backup and disaster recovery systems

## Installation

### Developer Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/blockfinax.git
   cd blockfinax
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to configure:
   - Database connection (if using PostgreSQL)
   - Blockchain network details
   - API keys and secrets

### Enterprise Installation

For enterprise deployments, we recommend the following approach:

1. **Infrastructure Setup**
   - Create a dedicated Virtual Private Cloud (VPC)
   - Set up database clusters with proper replication
   - Configure container orchestration (Kubernetes or similar)
   - Establish secure networking with proper segmentation

2. **Application Deployment**
   ```bash
   # Clone from enterprise repository
   git clone https://github.com/your-org/blockfinax-enterprise.git
   
   # Configure enterprise settings
   ./enterprise-configure.sh --env=production --ha=true --nodes=3
   
   # Deploy with high availability
   ./deploy.sh --cluster=production
   ```

3. **Security Configuration**
   - Generate SSL certificates and configure HTTPS
   - Set up Web Application Firewall (WAF)
   - Configure IP whitelisting for administrative access
   - Implement rate limiting and DDoS protection

4. **Integration Setup**
   - Connect to your enterprise identity provider (SAML/OIDC)
   - Configure blockchain node access
   - Establish secure connections to banking APIs
   - Set up audit logging and monitoring

Complete enterprise deployment guides are available in the [Enterprise Documentation](https://docs.blockfinax.com/enterprise-deployment).

## Starting the Application

### Development Environment

Start the development server:
```bash
npm run dev
```

This starts both the backend Express server and the frontend Vite development server.

The application will be available at:
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

### Production Environment

For production environments, use:
```bash
npm run start:production
```

This command:
1. Builds the frontend for production (optimized bundles)
2. Starts the Node.js server in production mode
3. Applies rate limiting and security measures
4. Enables performance optimization

### Enterprise Deployment

For enterprise high-availability deployments:

```bash
# Start the application cluster with load balancing
npm run start:enterprise

# Monitor cluster health
npm run monitor:cluster

# Scale the application based on demand
npm run scale:auto
```

Enterprise deployments leverage:
- Multiple Node.js instances for redundancy
- Load balancing across instances
- Memory optimization for high throughput
- Connection pooling for database efficiency
- Blockchain node connection management

For containerized deployments, use the provided Docker configuration:
```bash
docker-compose -f docker-compose.enterprise.yml up -d
```

## Platform Users

### Development Accounts

For development purposes, the following accounts are pre-configured:

| Account Type | Username | Password | Role | Description |
|-------------|----------|----------|------|-------------|
| Importer | `importer` | `password` | Buyer/Importer | Entity purchasing goods internationally |
| Exporter | `exporter` | `password` | Seller/Exporter | Entity selling and shipping goods internationally |
| Mediator | `mediator` | `password` | Mediator/Facilitator | Neutral third party for dispute resolution |
| Bank | `bank` | `password` | Financial Institution | Provides trade finance and payment services |
| Inspector | `inspector` | `password` | Quality Control | Verifies goods quality and documentation |
| Logistics | `logistics` | `password` | Shipping Provider | Manages transportation and customs processes |

### Enterprise User Management

In enterprise deployments, Blockfinax supports:

1. **Role-Based Access Control (RBAC)**
   - Fine-grained permission management
   - Custom role creation
   - Department-based access segmentation
   - Action-based permissions (view, edit, approve, etc.)

2. **Enterprise Identity Integration**
   - SAML 2.0 integration
   - OAuth 2.0 / OpenID Connect
   - Active Directory / LDAP
   - Multi-factor authentication (MFA)

3. **User Provisioning**
   - Automated user creation via SCIM 2.0
   - Just-in-time user provisioning
   - Deprovisioning workflows
   - Access certification and reviews

## Development Quick Tips

### Using In-Memory Storage

For quick development without a database, use the in-memory storage option:

1. Open `server/index.ts`
2. Ensure the `useInMemoryStorage` flag is set to `true`

### Creating a Test Contract

1. Log in as an Importer
2. Navigate to "New Trade Contract"
3. Fill in the contract details:
   - Title: Test Import Contract
   - Add the Exporter's address as a counterparty
   - Set trade terms
4. Submit the contract
5. Log in as the Exporter to approve the contract

### Testing Document Upload

1. Log in to any account
2. Navigate to "Documents"
3. Click "Upload Document"
4. Select a sample document
5. Link it to a contract if desired

### Testing the Escrow Process

1. Create a contract between Importer and Exporter
2. As Importer, fund the escrow
3. As Exporter, upload shipping documents
4. As Importer, confirm receipt of goods
5. Observe automatic fund release

## Building for Production

To build the application for production:

```bash
npm run build
```

The compiled application will be in the `dist` directory.

### Enterprise Deployment Options

Blockfinax supports various enterprise-grade deployment configurations:

1. **Dedicated Cloud Environment**
   - Azure, AWS, or Google Cloud
   - High-availability configuration
   - Automated scaling based on trade volume

2. **Private Blockchain Network**
   - Permissioned Ethereum network
   - Enterprise consensus mechanisms
   - Private transaction support

3. **On-Premises Installation**
   - Hardware security module integration
   - Air-gapped environment support
   - Enterprise firewall configuration

### Compliance and Auditing

For regulated industries, Blockfinax provides:

- Audit logging for all platform activities
- Compliance reporting tools
- Data retention policy enforcement
- GDPR and industry-specific compliance settings

## Running Tests

Run the test suite:

```bash
npm test
```

## Troubleshooting

### Common Issues

1. **Connection errors**:
   - Ensure PostgreSQL is running (if using database storage)
   - Check environment variables for correct database connection string
   - Verify network firewall settings for databases

2. **Blockchain connectivity**:
   - Verify blockchain network settings
   - Ensure you have test ETH if using a testnet
   - Check web3 provider configuration
   - Confirm gas price settings are appropriate for current network conditions

3. **API errors**:
   - Check browser console for detailed error messages
   - Verify API routes in server logs
   - Inspect authentication tokens and session validity
   - Review rate limiting thresholds

4. **Document Verification Issues**:
   - Check document hash generation configuration
   - Verify blockchain transaction confirmation settings
   - Ensure document metadata is correctly formatted

5. **Smart Contract Deployment**:
   - Confirm contract bytecode verification
   - Check contract deployment gas limits
   - Review contract initialization parameters
   - Verify contract ABI consistency between frontend and backend

6. **Performance Optimization**:
   - Implement database indexing for high-volume queries
   - Configure caching for repeated blockchain data requests
   - Optimize frontend bundle size for production deployment
   - Setup CDN for static asset delivery

### Getting Help

If you encounter issues:
- Check the detailed documentation in the [README.md](README.md)
- Review [TECHNICAL.md](TECHNICAL.md) for architecture details
- Submit an issue on the GitHub repository
- Access the Developer Portal at [developers.blockfinax.com](https://developers.blockfinax.com)
- Join our community Slack channel at [slack.blockfinax.com](https://slack.blockfinax.com)
- For enterprise customers, contact our dedicated support team at enterprise-support@blockfinax.com

#### Support SLAs

Blockfinax provides the following support SLAs:

| Plan Level | Response Time | 24/7 Support | Dedicated Engineer |
|------------|---------------|--------------|-------------------|
| Community  | 48 hours      | No           | No                |
| Business   | 8 hours       | Yes          | No                |
| Enterprise | 2 hours       | Yes          | Yes               |

For critical issues in production environments, our incident response team is available for immediate assistance for Business and Enterprise customers.

## Next Steps

After getting the application running:

1. Read [USER_GUIDE.md](USER_GUIDE.md) for detailed feature instructions
2. Explore [API_DOCS.md](API_DOCS.md) for API integration options
3. Review [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute to the project

### Implementation Roadmap

For a successful implementation, we recommend the following roadmap:

1. **Discovery & Planning** (1-2 weeks)
   - Assess your specific trade finance requirements
   - Define customization needs and integration points
   - Plan user roles and permission structure

2. **Development & Testing** (2-4 weeks)
   - Customize UI/UX according to branding guidelines
   - Integrate with existing systems (ERP, accounting, etc.)
   - Configure blockchain networks and smart contracts
   - Conduct security audits and penetration testing

3. **Deployment & Training** (1-2 weeks)
   - Deploy to chosen infrastructure
   - Set up monitoring and alerting
   - Train administrators and end users
   - Document custom implementation details

4. **Ongoing Support**
   - Regular security updates and maintenance
   - Performance monitoring and optimization
   - Feature enhancements and custom development

### Integration Partners

Blockfinax works seamlessly with the following enterprise systems:
- SAP ERP and S/4HANA
- Oracle NetSuite
- Microsoft Dynamics 365
- Salesforce
- Major banking and payment gateways
- Document management systems

For detailed integration documentation, visit our [Integration Hub](https://developers.blockfinax.com/integrations).

---

Happy trading with Blockfinax!

For more information, visit [blockfinax.com](https://blockfinax.com) or contact support@blockfinax.com