# Blockfinax Enterprise API Documentation

This comprehensive technical document provides detailed specifications for the RESTful API endpoints available in the Blockfinax platform. These robust, secure endpoints enable sophisticated programmatic interaction with all key platform functionality for enterprise integration and workflow automation.

## API Platform Overview

The Blockfinax API is designed as a comprehensive, enterprise-grade platform that follows RESTful principles while incorporating robust security measures and performance optimizations for high-volume trade finance operations.

### Core Technical Specifications

- **Base URL**: 
  - Production: `https://api.blockfinax.com/v1`
  - Sandbox: `https://sandbox-api.blockfinax.com/v1`
  - On-Premises Deployment: `/api/v1` (configurable)

- **Data Format**: 
  - All requests and responses use JSON format
  - UTF-8 encoding required for all requests
  - ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ) for all date/time fields
  - Decimal string representation for all monetary values to prevent floating-point precision errors

- **Authentication Options**:
  - **OAuth 2.0**: Industry-standard flow for secure delegated access
  - **API Keys**: HMAC-signed requests with rotating secrets
  - **JWT Tokens**: Short-lived tokens with configurable expiration
  - **Multi-factor Authentication**: Available for high-security deployments
  - **IP Whitelisting**: Restrict API access to specific IP ranges

- **Security Measures**:
  - TLS 1.3 with strong cipher suites required for all communications
  - Certificate pinning supported for enhanced security
  - Comprehensive audit logs for all API transactions
  - Request signing for non-repudiation of API calls

- **Performance Features**:
  - Global CDN distribution for API edge nodes
  - Response compression (gzip, brotli) for bandwidth optimization
  - Conditional requests (ETag, If-Modified-Since) for reduced data transfer
  - Batch operations for reduced round trips

- **Enterprise Integration**:
  - Synchronous RESTful endpoints for direct operations
  - Asynchronous webhook callbacks for event notifications
  - SFTP data exchange for large document sets
  - Comprehensive metadata for integration with existing systems

## Authentication API

### Session Management

#### Get Current Session

```
GET /api/auth/session
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "walletAddress": "0x123...",
  "profileImage": "/images/profile.jpg",
  "kycStatus": "VERIFIED"
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "user123",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "user123",
    "walletAddress": "0x123...",
    "profileImage": "/images/profile.jpg",
    "kycStatus": "VERIFIED"
  }
}
```

#### Logout

```
POST /api/auth/logout
```

**Response:**
```json
{
  "success": true
}
```

#### Register New User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "newuser",
  "password": "securepassword",
  "walletAddress": "0x123..." // Optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "newuser",
    "walletAddress": "0x123...",
    "kycStatus": "PENDING"
  }
}
```

## User API

#### Get User Profile

```
GET /api/users/:id
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "walletAddress": "0x123...",
  "profileImage": "/images/profile.jpg",
  "kycStatus": "VERIFIED",
  "riskScore": 85
}
```

#### Update User Profile

```
PATCH /api/users/:id
```

**Request Body:**
```json
{
  "profileImage": "/images/new-profile.jpg"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "user123",
  "walletAddress": "0x123...",
  "profileImage": "/images/new-profile.jpg",
  "kycStatus": "VERIFIED",
  "riskScore": 85
}
```

## Contract API

#### Get All Contracts

```
GET /api/contracts
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by contract status

**Response:**
```json
[
  {
    "id": 1,
    "contractAddress": "0xabc...",
    "title": "Coffee Bean Import",
    "description": "Import of 20 tons of arabica coffee beans",
    "status": "FUNDED",
    "createdBy": "user123",
    "createdAt": "2023-05-15T10:30:00Z",
    "updatedAt": "2023-05-16T14:20:00Z",
    "parties": [...],
    "tradeTerms": {...},
    "milestones": {...},
    "escrowWalletId": 5
  },
  // More contracts
]
```

#### Get Contract by ID

```
GET /api/contracts/:id
```

**Response:**
```json
{
  "id": 1,
  "contractAddress": "0xabc...",
  "title": "Coffee Bean Import",
  "description": "Import of 20 tons of arabica coffee beans",
  "status": "FUNDED",
  "createdBy": "user123",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-16T14:20:00Z",
  "parties": [
    {
      "address": "0x123...",
      "role": "IMPORTER",
      "name": "Coffee Distributors Inc.",
      "country": "United States"
    },
    {
      "address": "0x456...",
      "role": "EXPORTER",
      "name": "Colombian Coffee Farms",
      "country": "Colombia"
    }
  ],
  "tradeTerms": {
    "incoterm": "FOB",
    "paymentTerms": "Letter of Credit",
    "currency": "USD",
    "amount": 75000,
    "deliveryDeadline": "2023-06-15T00:00:00Z",
    "inspectionPeriod": 7,
    "disputeResolutionMechanism": "Arbitration"
  },
  "milestones": {
    "created": "2023-05-15T10:30:00Z",
    "funded": "2023-05-16T14:20:00Z"
  },
  "escrowWalletId": 5
}
```

#### Create New Contract

```
POST /api/contracts
```

**Request Body:**
```json
{
  "title": "Electronics Import",
  "description": "Import of 500 smartphones",
  "createdBy": "user123",
  "parties": [
    {
      "address": "0x123...",
      "role": "IMPORTER",
      "name": "Tech Distributors Ltd",
      "country": "United Kingdom"
    },
    {
      "address": "0x456...",
      "role": "EXPORTER",
      "name": "Shanghai Electronics",
      "country": "China"
    }
  ],
  "tradeTerms": {
    "incoterm": "CIF",
    "paymentTerms": "Open Account",
    "currency": "USD",
    "amount": 125000,
    "deliveryDeadline": "2023-08-01T00:00:00Z",
    "inspectionPeriod": 10,
    "disputeResolutionMechanism": "Mediation"
  }
}
```

**Response:**
```json
{
  "id": 2,
  "contractAddress": null,
  "title": "Electronics Import",
  "description": "Import of 500 smartphones",
  "status": "DRAFT",
  "createdBy": "user123",
  "createdAt": "2023-05-20T09:45:00Z",
  "updatedAt": "2023-05-20T09:45:00Z",
  "parties": [...],
  "tradeTerms": {...},
  "milestones": {
    "created": "2023-05-20T09:45:00Z"
  },
  "escrowWalletId": 6
}
```

#### Update Contract Status

```
PATCH /api/contracts/:id
```

**Request Body:**
```json
{
  "status": "GOODS_SHIPPED",
  "milestones": {
    "shipped": "2023-05-25T08:30:00Z"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "status": "GOODS_SHIPPED",
  "updatedAt": "2023-05-25T08:30:00Z",
  "milestones": {
    "created": "2023-05-15T10:30:00Z",
    "funded": "2023-05-16T14:20:00Z",
    "shipped": "2023-05-25T08:30:00Z"
  },
  // Other contract fields
}
```

## Document API

#### Get All Documents

```
GET /api/documents
```

**Query Parameters:**
- `contractId` (optional): Filter by contract ID
- `invoiceId` (optional): Filter by invoice ID
- `userId` (optional): Filter by user ID (for accessible documents)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Bill of Lading.pdf",
    "type": "BILL_OF_LADING",
    "size": 245678,
    "hash": "0xdf2c8...",
    "url": "/documents/bill_of_lading_1.pdf",
    "contractId": 1,
    "invoiceId": null,
    "uploadedBy": "user456",
    "uploadedAt": "2023-05-17T11:20:00Z",
    "tags": ["shipping", "original"],
    "access": [1, 3],
    "isVerified": true
  },
  // More documents
]
```

#### Get Document by ID

```
GET /api/documents/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Bill of Lading.pdf",
  "type": "BILL_OF_LADING",
  "size": 245678,
  "hash": "0xdf2c8...",
  "url": "/documents/bill_of_lading_1.pdf",
  "contractId": 1,
  "invoiceId": null,
  "uploadedBy": "user456",
  "uploadedAt": "2023-05-17T11:20:00Z",
  "tags": ["shipping", "original"],
  "access": [1, 3],
  "isVerified": true
}
```

#### Upload Document

```
POST /api/documents
```

**Request Body (multipart/form-data):**
- `file`: The document file
- `name`: Document name
- `type`: Document type
- `contractId` (optional): Associated contract ID
- `invoiceId` (optional): Associated invoice ID
- `tags` (optional): Array of tags
- `access` (optional): Array of user IDs who can access

**Response:**
```json
{
  "id": 2,
  "name": "Invoice_12345.pdf",
  "type": "INVOICE",
  "size": 156789,
  "hash": "0xabcd...",
  "url": "/documents/invoice_12345.pdf",
  "contractId": 1,
  "invoiceId": 1,
  "uploadedBy": "user123",
  "uploadedAt": "2023-05-20T15:45:00Z",
  "tags": ["financial", "original"],
  "access": [1, 2],
  "isVerified": false
}
```

#### Update Document Access

```
PATCH /api/documents/:id/access
```

**Request Body:**
```json
{
  "action": "grant",
  "userIds": [4, 5]
}
```

**Response:**
```json
{
  "id": 1,
  "access": [1, 3, 4, 5],
  // Other document fields
}
```

## Wallet API

#### Get User Wallets

```
GET /api/wallets/user/:userId
```

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "walletType": "MAIN",
    "contractId": null,
    "balance": "10000.00",
    "currency": "USD",
    "createdAt": "2023-04-10T09:00:00Z",
    "updatedAt": "2023-05-18T14:35:00Z"
  },
  {
    "id": 5,
    "userId": 1,
    "walletType": "ESCROW",
    "contractId": 1,
    "balance": "75000.00",
    "currency": "USD",
    "createdAt": "2023-05-15T10:35:00Z",
    "updatedAt": "2023-05-16T14:20:00Z"
  }
]
```

#### Get Wallet by ID

```
GET /api/wallets/:id
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "walletType": "MAIN",
  "contractId": null,
  "balance": "10000.00",
  "currency": "USD",
  "createdAt": "2023-04-10T09:00:00Z",
  "updatedAt": "2023-05-18T14:35:00Z"
}
```

#### Create Transaction

```
POST /api/transactions
```

**Request Body:**
```json
{
  "fromWalletId": 1,
  "toWalletId": 5,
  "amount": "75000.00",
  "currency": "USD",
  "txType": "ESCROW_LOCK",
  "contractId": 1,
  "description": "Funding escrow for coffee import contract"
}
```

**Response:**
```json
{
  "id": 3,
  "fromWalletId": 1,
  "toWalletId": 5,
  "amount": "75000.00",
  "currency": "USD",
  "txType": "ESCROW_LOCK",
  "status": "COMPLETED",
  "contractId": 1,
  "description": "Funding escrow for coffee import contract",
  "createdAt": "2023-05-16T14:20:00Z",
  "metadata": null
}
```

## Invoice API

#### Get All Invoices

```
GET /api/invoices
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `role` (optional): Filter by role ('buyer' or 'seller')
- `contractId` (optional): Filter by contract ID

**Response:**
```json
[
  {
    "id": 1,
    "invoiceNumber": "INV-2023-001",
    "contractId": 1,
    "sellerId": 2,
    "buyerId": 1,
    "amount": "75000.00",
    "currency": "USD",
    "issueDate": "2023-05-17T10:00:00Z",
    "dueDate": "2023-06-17T00:00:00Z",
    "status": "UNPAID",
    "items": [
      {
        "description": "Arabica Coffee Beans",
        "quantity": 20,
        "unitPrice": 3750,
        "totalPrice": 75000
      }
    ],
    "paymentTerms": "Net 30",
    "notes": "Please reference invoice number with payment"
  },
  // More invoices
]
```

#### Create Invoice

```
POST /api/invoices
```

**Request Body:**
```json
{
  "invoiceNumber": "INV-2023-002",
  "contractId": 2,
  "sellerId": 3,
  "buyerId": 1,
  "amount": "125000.00",
  "currency": "USD",
  "dueDate": "2023-09-01T00:00:00Z",
  "status": "UNPAID",
  "items": [
    {
      "description": "Smartphone Model X",
      "quantity": 500,
      "unitPrice": 250,
      "totalPrice": 125000
    }
  ],
  "paymentTerms": "Net 30",
  "notes": "Includes 1-year warranty"
}
```

**Response:**
```json
{
  "id": 2,
  "invoiceNumber": "INV-2023-002",
  "contractId": 2,
  "sellerId": 3,
  "buyerId": 1,
  "amount": "125000.00",
  "currency": "USD",
  "issueDate": "2023-05-20T10:15:00Z",
  "dueDate": "2023-09-01T00:00:00Z",
  "status": "UNPAID",
  "items": [...],
  "paymentTerms": "Net 30",
  "notes": "Includes 1-year warranty"
}
```

## Trade Finance API

#### Get Trade Finance Applications

```
GET /api/trade-finance
```

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `contractId` (optional): Filter by contract ID
- `status` (optional): Filter by application status

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "contractId": 1,
    "applicationType": "LETTER_OF_CREDIT",
    "amount": "75000.00",
    "currency": "USD",
    "status": "APPROVED",
    "applicationDate": "2023-05-15T14:30:00Z",
    "approvalDate": "2023-05-18T11:20:00Z",
    "expiryDate": "2023-07-18T00:00:00Z",
    "terms": {
      "issuerBank": "International Trade Bank",
      "beneficiaryBank": "Colombian National Bank",
      "conditions": "Shipment before June 15, 2023"
    },
    "supportingDocuments": [3, 4]
  },
  // More applications
]
```

#### Submit Trade Finance Application

```
POST /api/trade-finance
```

**Request Body:**
```json
{
  "userId": 1,
  "contractId": 2,
  "applicationType": "BANK_GUARANTEE",
  "amount": "50000.00",
  "currency": "USD",
  "expiryDate": "2023-10-01T00:00:00Z",
  "terms": {
    "guarantorBank": "Global Trade Bank",
    "beneficiary": "Shanghai Electronics",
    "conditions": "Performance guarantee for electronics import"
  },
  "supportingDocuments": [5, 6]
}
```

**Response:**
```json
{
  "id": 2,
  "userId": 1,
  "contractId": 2,
  "applicationType": "BANK_GUARANTEE",
  "amount": "50000.00",
  "currency": "USD",
  "status": "PENDING",
  "applicationDate": "2023-05-20T16:45:00Z",
  "approvalDate": null,
  "expiryDate": "2023-10-01T00:00:00Z",
  "terms": {...},
  "supportingDocuments": [5, 6]
}
```

## KYC API

#### Submit KYC Data

```
POST /api/kyc
```

**Request Body:**
```json
{
  "userId": 1,
  "kycData": {
    "firstName": "John",
    "lastName": "Smith",
    "dateOfBirth": "1980-05-15",
    "nationality": "United States",
    "residenceCountry": "United States",
    "idType": "PASSPORT",
    "idNumber": "123456789",
    "idExpiryDate": "2028-03-21",
    "companyName": "Coffee Distributors Inc.",
    "companyRegistrationNumber": "US12345678",
    "companyType": "LLC",
    "businessCategory": "Wholesale",
    "contactDetails": {
      "email": "john@coffeedistr.com",
      "phone": "+1-555-123-4567"
    }
  }
}
```

**Response:**
```json
{
  "userId": 1,
  "kycStatus": "PENDING",
  "kycData": {...},
  "message": "KYC submission successful, verification in progress"
}
```

#### Update KYC Status

```
PATCH /api/kyc/:userId
```

**Request Body:**
```json
{
  "status": "VERIFIED",
  "riskScore": 85
}
```

**Response:**
```json
{
  "userId": 1,
  "kycStatus": "VERIFIED",
  "riskScore": 85,
  "message": "KYC verification completed successfully"
}
```

## Enterprise Error Handling Framework

Blockfinax implements a comprehensive error handling system designed for enterprise integration requirements, providing detailed diagnostic information while maintaining security best practices.

### Standardized Error Response Format

All API endpoints return a consistent error response structure:

```json
{
  "error": true,
  "message": "Human-readable error description",
  "code": "MACHINE_READABLE_ERROR_CODE",
  "requestId": "unique-request-identifier-for-tracing",
  "timestamp": "2023-05-20T10:15:00Z",
  "details": {
    "field": "specific_field_with_error",
    "constraint": "validation_rule_that_failed",
    "value": "provided_value_that_caused_error",
    "allowedValues": ["list", "of", "acceptable", "values"],
    "additionalInfo": "Detailed context-specific information"
  },
  "documentation": "https://developers.blockfinax.com/errors/MACHINE_READABLE_ERROR_CODE"
}
```

### Comprehensive Error Classification

Errors are categorized into the following hierarchical groups:

#### Authentication & Authorization Errors
- `AUTH_REQUIRED`: Authentication credentials not provided
- `AUTH_INVALID`: Authentication credentials invalid
- `AUTH_EXPIRED`: Authentication token expired
- `AUTH_INSUFFICIENT`: Authenticated user lacks required permissions
- `MFA_REQUIRED`: Multi-factor authentication required for this operation
- `IP_RESTRICTED`: Request IP not on allowed list

#### Resource Errors
- `RESOURCE_NOT_FOUND`: Requested resource does not exist
- `RESOURCE_ALREADY_EXISTS`: Cannot create resource that already exists
- `RESOURCE_CONFLICT`: Resource state conflicts with request
- `RESOURCE_LOCKED`: Resource is currently locked by another operation
- `RESOURCE_DELETED`: Resource has been deleted
- `RESOURCE_LIMIT_EXCEEDED`: Account resource limit reached

#### Validation Errors
- `VALIDATION_REQUIRED_FIELD`: Required field missing
- `VALIDATION_FORMAT`: Field format is invalid
- `VALIDATION_TYPE`: Field type is incorrect
- `VALIDATION_RANGE`: Value outside allowed range
- `VALIDATION_LENGTH`: String length outside allowed range
- `VALIDATION_ENUM`: Value not in allowed set
- `VALIDATION_RELATIONSHIP`: Referenced entity does not exist or is invalid

#### Business Logic Errors
- `BUSINESS_INSUFFICIENT_FUNDS`: Wallet has insufficient balance
- `BUSINESS_CONTRACT_INVALID_STATE`: Contract state does not allow operation
- `BUSINESS_DOCUMENT_VERIFICATION_FAILED`: Document verification process failed
- `BUSINESS_KYC_REQUIRED`: KYC verification required for this operation
- `BUSINESS_TRANSACTION_DECLINED`: Transaction declined by business rules
- `BUSINESS_WORKFLOW_VIOLATION`: Operation violates defined workflow sequence

#### System Errors
- `SYSTEM_UNAVAILABLE`: Service temporarily unavailable
- `SYSTEM_TIMEOUT`: Operation timed out
- `SYSTEM_OVERLOADED`: System under high load, try again later
- `SYSTEM_MAINTENANCE`: System in maintenance mode
- `SYSTEM_INTEGRATION_FAILURE`: External system integration failure
- `SYSTEM_DATABASE_ERROR`: Database operation failed

#### Blockchain Errors
- `BLOCKCHAIN_NETWORK_UNAVAILABLE`: Blockchain network currently unavailable
- `BLOCKCHAIN_TRANSACTION_FAILED`: Blockchain transaction execution failed
- `BLOCKCHAIN_GAS_PRICE_TOO_LOW`: Gas price too low for transaction
- `BLOCKCHAIN_CONTRACT_EXECUTION_ERROR`: Smart contract execution error
- `BLOCKCHAIN_NONCE_ERROR`: Transaction nonce error
- `BLOCKCHAIN_CONFIRMATION_TIMEOUT`: Transaction confirmation timeout

### Error Handling Best Practices

1. **Check Error Codes**: Applications should check the specific `code` field for programmatic error handling.
2. **Implement Retries**: For 5XX errors or certain 4XX errors (SYSTEM_TIMEOUT, SYSTEM_OVERLOADED), implement exponential backoff retry logic.
3. **Log Request IDs**: Always log the `requestId` field for end-to-end request tracing.
4. **Parse Details**: For validation errors, parse the `details` object to present specific field-level errors.
5. **Reference Documentation**: Use the `documentation` URL for detailed error resolution guidance.
6. **Monitor Error Rates**: Establish monitoring for error rate thresholds as an early warning system.

### HTTP Status Code Mapping

Blockfinax API uses standard HTTP status codes in combination with detailed error objects:

- **400 Bad Request**: Validation errors, malformed requests
- **401 Unauthorized**: Authentication errors
- **403 Forbidden**: Authorization errors
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflicts
- **422 Unprocessable Entity**: Business logic errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected system errors
- **502 Bad Gateway**: Integration errors with external systems
- **503 Service Unavailable**: System temporarily unavailable

## Enterprise Rate Management System

Blockfinax implements a sophisticated adaptive rate management system that balances platform reliability with the high-throughput demands of enterprise clients, global financial institutions, and trade finance operations.

### Tiered Rate Limit Structure

Rate limits are applied at multiple levels based on client tier, API endpoint sensitivity, and usage patterns:

| Client Tier | Standard Operations | High-Volume Operations | Bulk Operations |
|-------------|-------------------:|-------------------:|----------------:|
| **Standard** | 100 req/min | 60 req/min | 10 req/min |
| **Business** | 300 req/min | 180 req/min | 30 req/min |
| **Enterprise** | Custom | Custom | Custom |
| **Financial Institution** | Custom | Custom | Custom |

### Dynamic Rate Adjustment

The platform implements a dynamic rate limiting approach that:

- Increases limits during business hours in client's primary time zone
- Provides temporary burst capacity for seasonal trade activities
- Adjusts automatically based on platform load and health metrics
- Offers scheduled rate increases for planned high-volume operations

### Rate Limit Headers

All API responses include the following headers for monitoring rate limit status:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 297
X-RateLimit-Reset: 1683730000
X-RateLimit-Used: 3
```

### Consumption Optimization

For high-volume integrations, Blockfinax provides several methods to optimize API consumption:

1. **Bulk Endpoints**: Special endpoints for batch processing multiple operations in a single request
2. **Conditional Requests**: Support for ETag and If-Modified-Since headers to avoid unnecessary data transfers
3. **Webhooks**: Push-based notifications for resource changes to reduce polling
4. **Partial Response**: Field filtering with the `fields` parameter to reduce response size
5. **Delta Updates**: Retrieving only changes since a timestamp or sequence ID

### Rate Limit Exceeded Response

When rate limits are exceeded, the API returns:

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1683730000
Retry-After: 60

{
  "error": true,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please retry after 60 seconds.",
  "retryAfter": 60,
  "documentation": "https://developers.blockfinax.com/rate-limits"
}
```

### Enterprise Rate Customization

Enterprise clients can request customized rate limit configurations based on:

- Expected transaction volume and patterns
- Geographic distribution of API requests
- Business criticality of specific endpoints
- Trade volume and frequency patterns

Contact enterprise-api@blockfinax.com to discuss your specific requirements.

## Enterprise Event Integration System

Blockfinax provides a robust, enterprise-grade webhook notification system for real-time event integration with your existing systems:

1. **Configure Webhook URL**:
```
POST /api/webhooks
```

2. **Subscribe to Events**:
```json
{
  "url": "https://your-domain.com/webhook",
  "events": [
    "contract.created",
    "contract.statusChanged",
    "document.uploaded",
    "transaction.completed"
  ],
  "secret": "your-webhook-secret"
}
```

3. **Event Payload Example**:
```json
{
  "event": "contract.statusChanged",
  "timestamp": "2023-05-25T08:30:00Z",
  "data": {
    "contractId": 1,
    "previousStatus": "FUNDED",
    "newStatus": "GOODS_SHIPPED"
  }
}
```

---

This API documentation is subject to change as the Blockfinax platform evolves. For the most current technical specifications, expanded integration examples, and SDK code samples, please refer to our dedicated Developer Portal at developers.blockfinax.com or contact our enterprise integration team at enterprise-api@blockfinax.com.