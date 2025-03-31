export interface ISetFinalityOrder {
  email: string;
  finalityOrder: string;
  id: string;
}

export interface OrderDataProps {
  orderId: string;
  status: string;
  clientProfileData: {
    userProfileId: string;
    email: string;
    firstName: string;
    lastName: string;
    document: string;
  };
  items: Array<{
    name: string;
    id: string;
    price: string;
  }>;
}

export interface IData {
  rclastcart: string;
  email: string;
  firstName: string;
}

interface Grouping {
  key: string;
  amount: number;
}

interface Configuration {
  lastModifiedUtc: string;
  utmSource: string;
  utmCampaign: string;
  isArchived: boolean;
  maxItemsPerClient: number;
  expirationIntervalPerUse: string;
  maxUsage: number;
  groupingKey: string;
}

interface Item {
  grouping: Grouping;
  configuration: Configuration;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface ICuponRequest {
  items: Item[];
  pagination: Pagination;
}
