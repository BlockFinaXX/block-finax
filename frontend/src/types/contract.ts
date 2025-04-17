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

export enum PartyRole {
  IMPORTER = 'IMPORTER',
  EXPORTER = 'EXPORTER',
  MEDIATOR = 'MEDIATOR'
}

export interface Party {
  address: string;
  role: PartyRole;
  name: string;
  country: string;
}

export interface TradeTerms {
  incoterm: string; // EXW, FOB, CIF, etc.
  paymentTerms: string; // Letter of Credit, Open Account, etc.
  currency: string; 
  amount: number;
  deliveryDeadline: Date;
  inspectionPeriod: number; // in days
  disputeResolutionMechanism: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  documentType: string; // Bill of Lading, Invoice, Certificate of Origin, etc.
  hash: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
}

export interface EscrowContract {
  id: string;
  contractAddress?: string;
  title: string;
  description: string;
  status: ContractStatus;
  parties: Party[];
  tradeTerms: TradeTerms;
  documents: ContractDocument[];
  createdAt: Date;
  updatedAt: Date;
  milestones: {
    created: Date;
    funded?: Date;
    shipped?: Date;
    received?: Date;
    completed?: Date;
    disputed?: Date;
  };
}

export const getStatusColor = (status: ContractStatus | string): string => {
  switch (status) {
    case ContractStatus.DRAFT:
      return 'gray';
    case ContractStatus.AWAITING_FUNDS:
      return 'yellow';
    case ContractStatus.FUNDED:
      return 'green';
    case ContractStatus.GOODS_SHIPPED:
      return 'blue';
    case ContractStatus.GOODS_RECEIVED:
      return 'indigo';
    case ContractStatus.COMPLETED:
      return 'green';
    case ContractStatus.DISPUTED:
      return 'red';
    case ContractStatus.CANCELLED:
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusText = (status: ContractStatus | string): string => {
  return status.toString().replace('_', ' ');
};
