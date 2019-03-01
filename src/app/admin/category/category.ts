export interface CategoryModel {
    categoryID: number;
    categoryName: string;
    categoryDescription: string;
    isActive: boolean;
    createdBy: number;
    createdDate: Date;
    createdUser: string;
    modifiedBy?: number;
    modifiedDate?: Date;
    modifiedUser?: string;
    parentCategory: boolean;
    childCategory?: number;
    imageContent?: any;
    imageID: number;
    associatedProducts?: number;
}

