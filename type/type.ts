export interface StaffData {
  id: string;
  lastName: string;
  firstName: string;
  patronymicName: string;
  inn: string;
  phoneNumber: string;
  unitName: string;
  positionName: string;
  staffType: string;
  hiredOn: string;
  dismissedOn: string;
  status: string;
  lastModifiedAt: string;
  idTelegramm: number;
  unitId: string;
  departmentName: string;
}

export interface CouriersOrder {
  orderId: string;
  orderNumber: string;
  courierStaffId: string;
  unitName: string;
  handedOverToDeliveryAt: string;
  predictedDeliveryTimeMin: number;
  deliveryTimeMin: number;
  orderFulfilmentFlagAt: string;
  isFalseDelivery: boolean;
  deliveryTransportName: string;
  tripOrdersCount: number;
  heatedShelfTime: number;
  orderAssemblyAvgTime: number;
  sectorName: string;
  wasLateDeliveryVoucherGiven: boolean;
  courierComment: string;
  decisionManager: string;
  typeOfOffense: string;
  message: true;
  extraTime: number;
  fio: string;
  inn: string;
  idTelegramm: number;
  expiration: number;
  dublicate: boolean;
  graphistComment: string;
  directorComment: {
    content: string;
    isSendToCourier: boolean;
    date: string;
  };
  dateResponceCourier: string;
  departmentName: string;
  urlPhoto?: string;
  unitId: string;
}

export interface Departments {
  DepartmentUUId: string;
  departmentName: string;
  units: [string];
  organizations: [string];
  access_token: string;
  passwordAdm: string;
}

export interface UnitsSettings {
  type: string;
  unitName: string;
  unitId: string;
  programs: [{ name: string; isActive: boolean }];
  idTelegramm: [{ id: number; nameFunction: boolean; fio: boolean }];
  departmentUUId: string;
  departmentName: string;
  timeZoneShift: number;
  RestaurantWeekWorkingTime: [{ DayIndex: number; DayAlias: string; WorkingTimeStart: number; WorkingTimeEnd: number }];
  DeliveryWeekWorkingTime: [{ DayIndex: number; DayAlias: string; WorkingTimeStart: number; WorkingTimeEnd: number }];
  isActive: boolean;
}
