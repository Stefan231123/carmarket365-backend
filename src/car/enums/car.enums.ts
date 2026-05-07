import { registerEnumType } from '@nestjs/graphql';

export enum VehicleType {
  CAR = 'CAR',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  MOTORCYCLE = 'MOTORCYCLE',
  OTHER = 'OTHER',
}
registerEnumType(VehicleType, { name: 'VehicleType' });

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  PLUGIN_HYBRID = 'PLUGIN_HYBRID',
  LPG = 'LPG',
  CNG = 'CNG',
  OTHER = 'OTHER',
}
registerEnumType(FuelType, { name: 'FuelType' });

export enum TransmissionType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
  CVT = 'CVT',
}
registerEnumType(TransmissionType, { name: 'TransmissionType' });

export enum CarCondition {
  NEW = 'NEW',
  USED = 'USED',
  CERTIFIED_PRE_OWNED = 'CERTIFIED_PRE_OWNED',
}
registerEnumType(CarCondition, { name: 'CarCondition' });

export enum DrivetrainType {
  FWD = 'FWD',
  RWD = 'RWD',
  AWD = 'AWD',
  FOUR_WD = 'FOUR_WD',
}
registerEnumType(DrivetrainType, { name: 'DrivetrainType' });
