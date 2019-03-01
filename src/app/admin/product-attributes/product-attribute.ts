export interface ProductAttributeModel {
    attributeID: number;
    attributeName: string;
    createdBy: number;
    createdDate: Date;
    createdUser: string;
    modifiedBy?: number;
    modifiedDate?: Date;
    modifiedUser?: string;
    associatedProductValues?: number;
}
