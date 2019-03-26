export interface CategoryModel {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdBy: number;
    createdDate: Date;
    createdUser: string;
    modifiedBy?: number;
    modifiedDate?: Date;
    modifiedUser?: string;
    parent: boolean;
    child?: number;
    imageContent?: any;
    imageID: number;
    associatedProducts?: number;
}

